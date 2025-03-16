import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format, addDays, differenceInDays } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { rooms } from '@/utils/data';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookingDetails {
  roomId: string;
  checkInDate: Date;
  guests: number;
}

const TAX_RATE = 0.05; // 5% tax

const BookingSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get initial booking details from location state
  const initialDetails = location.state?.bookingDetails;
  if (!initialDetails) {
    navigate('/rooms');
    return null;
  }

  const room = rooms.find(r => r.id === initialDetails.roomId);
  if (!room) {
    navigate('/rooms');
    return null;
  }

  // Initialize dates from the passed state
  const initialCheckInDate = new Date(initialDetails.checkInDate);
  const initialCheckOutDate = new Date(initialDetails.checkOutDate);
  const initialNights = differenceInDays(initialCheckOutDate, initialCheckInDate);

  const [bookingDetails, setBookingDetails] = useState({
    fullName: '',
    email: user?.email || '',
    checkInDate: initialCheckInDate,
    checkOutDate: initialCheckOutDate,
    guests: initialDetails.guests,
    specialRequests: ''
  });

  const numberOfNights = differenceInDays(bookingDetails.checkOutDate, bookingDetails.checkInDate);
  const subtotal = room.price * numberOfNights;
  const taxAmount = subtotal * TAX_RATE;
  const totalAmount = subtotal + taxAmount;

  // Update validation to preserve number of nights
  const validateDates = () => {
    const currentNights = differenceInDays(bookingDetails.checkOutDate, bookingDetails.checkInDate);
    if (currentNights < 1) {
      setBookingDetails(prev => ({
        ...prev,
        checkOutDate: addDays(prev.checkInDate, initialNights)
      }));
    }
  };

  useEffect(() => {
    validateDates();
  }, [bookingDetails.checkInDate]);

  // Handle check-in date change
  const handleCheckInDateChange = (date: Date | undefined) => {
    if (date) {
      const currentNights = differenceInDays(bookingDetails.checkOutDate, bookingDetails.checkInDate);
      setBookingDetails(prev => ({
        ...prev,
        checkInDate: date,
        checkOutDate: addDays(date, currentNights)
      }));
    }
  };

  // Handle check-out date change
  const handleCheckOutDateChange = (date: Date | undefined) => {
    if (date && date > bookingDetails.checkInDate) {
      setBookingDetails(prev => ({
        ...prev,
        checkOutDate: date
      }));
    }
  };

  const handleConfirmBooking = async () => {
    if (!user) {
      navigate('/login', { 
        state: { 
          from: location.pathname,
          message: 'Please log in to complete your booking'
        } 
      });
      return;
    }

    if (!bookingDetails.fullName || !bookingDetails.email) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First check if the room is available for these dates
      const { data: existingBookings, error: checkError } = await supabase
        .from('bookings')
        .select('*')
        .eq('room_id', room.id)
        .eq('status', 'confirmed')
        .or(`check_in_date.lte.${bookingDetails.checkOutDate.toISOString()},check_out_date.gte.${bookingDetails.checkInDate.toISOString()}`);

      if (checkError) throw checkError;

      if (existingBookings && existingBookings.length > 0) {
        setError('This room is not available for the selected dates');
        return;
      }

      // Navigate to payment page
      navigate('/payment', {
        state: {
          bookingDetails: {
            id: `BOOKING-${Date.now()}`,
            name: bookingDetails.fullName,
            email: bookingDetails.email,
            roomId: room.id,
            roomName: room.name,
            checkIn: bookingDetails.checkInDate.toISOString(),
            checkOut: bookingDetails.checkOutDate.toISOString(),
            guests: bookingDetails.guests,
            nights: numberOfNights,
            pricePerNight: room.price,
            subtotal: subtotal,
            tax: taxAmount,
            totalPrice: totalAmount,
            specialRequests: bookingDetails.specialRequests
          }
        }
      });
    } catch (err) {
      console.error('Booking error:', err);
      setError(err instanceof Error ? err.message : 'Failed to confirm booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Booking Summary</h1>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Room Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">{room.name}</h3>
                    <p className="text-gray-600">{room.description}</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Check-in Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !bookingDetails.checkInDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {bookingDetails.checkInDate ? format(bookingDetails.checkInDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={bookingDetails.checkInDate}
                            onSelect={handleCheckInDateChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label>Check-out Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !bookingDetails.checkOutDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {bookingDetails.checkOutDate ? format(bookingDetails.checkOutDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={bookingDetails.checkOutDate}
                            onSelect={handleCheckOutDateChange}
                            disabled={(date) => date <= bookingDetails.checkInDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Guest Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={bookingDetails.fullName}
                      onChange={(e) => setBookingDetails(prev => ({
                        ...prev,
                        fullName: e.target.value
                      }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={bookingDetails.email}
                      onChange={(e) => setBookingDetails(prev => ({
                        ...prev,
                        email: e.target.value
                      }))}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="guests">Number of Guests</Label>
                    <Input
                      id="guests"
                      type="number"
                      min={1}
                      max={room.capacity}
                      value={bookingDetails.guests}
                      onChange={(e) => setBookingDetails(prev => ({
                        ...prev,
                        guests: parseInt(e.target.value)
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="specialRequests">Special Requests</Label>
                    <textarea
                      id="specialRequests"
                      className="w-full min-h-[100px] px-3 py-2 rounded-md border"
                      value={bookingDetails.specialRequests}
                      onChange={(e) => setBookingDetails(prev => ({
                        ...prev,
                        specialRequests: e.target.value
                      }))}
                      placeholder="Any special requests or requirements?"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Price Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Room Rate (per night)</span>
                    <span>${room.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Number of Nights</span>
                    <span>{numberOfNights}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (5%)</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full"
              size="lg"
              onClick={handleConfirmBooking}
              disabled={isLoading || !bookingDetails.fullName || !bookingDetails.email}
            >
              {isLoading ? 'Processing...' : 'Proceed to Payment'}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingSummary; 