import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { rooms } from '@/utils/data';
import Layout from '@/components/Layout';
import { format } from 'date-fns';

interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  name: string;
}

interface BookingDetails {
  roomId: string;
  checkInDate: string;
  guests: number;
  totalPrice: number;
}

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  useEffect(() => {
    // Get booking details from location state
    const details = location.state?.bookingDetails;
    if (!details) {
      navigate('/rooms');
      return;
    }
    setBookingDetails(details);
  }, [location.state, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return; // 16 digits + 3 spaces
    }

    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .substring(0, 5);
    }

    // Limit CVV to 3 digits
    if (name === 'cvv' && value.length > 3) return;

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDetails) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login', { state: { from: '/payment' } });
        return;
      }

      // In a real application, you would:
      // 1. Validate the card details
      // 2. Process the payment through a payment gateway
      // 3. Store the booking in your database only after successful payment

      // For now, we'll just create the booking
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          room_id: bookingDetails.roomId,
          check_in_date: bookingDetails.checkInDate,
          guests: bookingDetails.guests,
          total_price: bookingDetails.totalPrice,
          status: 'confirmed',
        });

      if (bookingError) throw bookingError;

      // Redirect to success page
      navigate('/my-bookings', {
        state: { message: 'Booking confirmed successfully!' }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process payment');
    } finally {
      setIsLoading(false);
    }
  };

  const room = bookingDetails ? rooms.find(r => r.id === bookingDetails.roomId) : null;

  if (!bookingDetails || !room) return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{room.name}</h3>
                <p className="text-gray-600">{room.description}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Check-in Date</span>
                  <span>{format(new Date(bookingDetails.checkInDate), 'PPP')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Guests</span>
                  <span>{bookingDetails.guests}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Price</span>
                  <span>${bookingDetails.totalPrice}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>
                Enter your card details to complete the booking
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    name="name"
                    placeholder="Cardholder Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Input
                    name="cardNumber"
                    placeholder="Card Number"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    required
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    name="cvv"
                    placeholder="CVV"
                    type="password"
                    value={formData.cvv}
                    onChange={handleChange}
                    required
                    maxLength={3}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing Payment...' : `Pay $${bookingDetails.totalPrice}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Payment; 