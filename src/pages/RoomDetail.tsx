import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addDays, differenceInDays } from 'date-fns';
import { Calendar as CalendarIcon, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { rooms } from '@/utils/data';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [guests, setGuests] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const checkOutRef = useRef<HTMLButtonElement>(null);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);

  const room = rooms.find(r => r.id === id);

  useEffect(() => {
    loadBookedDates();
  }, [id]);

  const loadBookedDates = async () => {
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('check_in_date, check_out_date')
        .eq('room_id', id);

      if (error) throw error;

      const dates: Date[] = [];
      bookings?.forEach(booking => {
        const start = new Date(booking.check_in_date);
        const end = new Date(booking.check_out_date);
        
        // Add all dates between check-in and check-out
        for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
          dates.push(new Date(date));
        }
      });

      setBookedDates(dates);
    } catch (error) {
      console.error('Error loading booked dates:', error);
    }
  };

  const isDateBooked = (date: Date) => {
    return bookedDates.some(bookedDate => 
      bookedDate.getFullYear() === date.getFullYear() &&
      bookedDate.getMonth() === date.getMonth() &&
      bookedDate.getDate() === date.getDate()
    );
  };

  if (!room) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>Room not found</AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
  };

  const handleBooking = async () => {
    if (!checkInDate) {
      setError('Please select a check-in date');
      return;
    }

    if (!checkOutDate) {
      setError('Please select a check-out date');
      return;
    }

    if (checkOutDate <= checkInDate) {
      setError('Check-out date must be after check-in date');
      return;
    }

    if (guests < 1 || guests > room.capacity) {
      setError(`Number of guests must be between 1 and ${room.capacity}`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (!user) {
        navigate('/login', { 
          state: { 
            from: `/rooms/${id}`,
            message: 'Please log in to book a room'
          } 
        });
        return;
      }

      const numberOfNights = differenceInDays(checkOutDate, checkInDate);
      const totalPrice = room.price * numberOfNights;

      // Navigate to booking summary page
      navigate('/booking-summary', {
        state: {
          bookingDetails: {
            roomId: room.id,
            roomName: room.name,
            checkInDate: checkInDate.toISOString(),
            checkOutDate: checkOutDate.toISOString(),
            guests,
            numberOfNights,
            pricePerNight: room.price,
            totalPrice
          }
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process booking');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckInSelect = (date: Date | undefined) => {
    setCheckInDate(date);
    if (date) {
      // Set minimum check-out date to one day after check-in
      const minCheckOut = new Date(date);
      minCheckOut.setDate(minCheckOut.getDate() + 1);
      setCheckOutDate(minCheckOut);
      
      // Clear check-out date if it's before the new minimum
      if (checkOutDate && checkOutDate < minCheckOut) {
        setCheckOutDate(undefined);
      }

      // Focus the check-out date picker after a short delay
      setTimeout(() => {
        checkOutRef.current?.click();
      }, 100);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Room Images */}
          <div className="relative aspect-video rounded-lg overflow-hidden mb-8">
            <img
              src={room.images[currentImageIndex]}
              alt={`${room.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            
            {room.images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={previousImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {room.images.map((_, index) => (
                    <button
                      key={index}
                      className={cn(
                        "w-2 h-2 rounded-full transition-colors",
                        currentImageIndex === index
                          ? "bg-white"
                          : "bg-white/50 hover:bg-white/75"
                      )}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {room.images.length > 1 && (
            <div className="grid grid-cols-6 gap-2 mb-8">
              {room.images.map((image, index) => (
                <button
                  key={index}
                  className={cn(
                    "relative aspect-video rounded-lg overflow-hidden",
                    currentImageIndex === index && "ring-2 ring-primary"
                  )}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`${room.name} - Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-8">
            {/* Room Details */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{room.name}</h1>
                <p className="text-gray-600">{room.description}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Room Features</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-gray-500" />
                    <span>Up to {room.capacity} guests</span>
                  </div>
                  <div>
                    <span>{room.size} sq ft</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Amenities</h2>
                <ul className="grid grid-cols-2 gap-2">
                  {room.amenities.map((amenity, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span>• {amenity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Booking Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>${room.price}</span>
                  <span className="text-sm text-gray-500">per night</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label>Check-in Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkInDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkInDate ? format(checkInDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkInDate}
                        onSelect={handleCheckInSelect}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                          isDateBooked(date)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Check-out Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        ref={checkOutRef}
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkOutDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkOutDate ? format(checkOutDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkOutDate}
                        onSelect={setCheckOutDate}
                        disabled={(date) =>
                          !checkInDate ||
                          date <= checkInDate ||
                          isDateBooked(date)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Number of Guests</label>
                  <Input
                    type="number"
                    min={1}
                    max={room.capacity}
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                  />
                  <p className="text-sm text-gray-500">
                    Max {room.capacity} guests
                  </p>
                </div>

                {checkInDate && checkOutDate && (
                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span>Price per night</span>
                      <span>${room.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Number of nights</span>
                      <span>{differenceInDays(checkOutDate, checkInDate)}</span>
                    </div>
                    <div className="flex justify-between font-semibold mt-2 pt-2 border-t">
                      <span>Total</span>
                      <span>${room.price * differenceInDays(checkOutDate, checkInDate)}</span>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={handleBooking}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Book Now'}
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  You won't be charged yet
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RoomDetail;
