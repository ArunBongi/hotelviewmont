import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2 } from 'lucide-react';

interface Booking {
  id: string;
  room_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: string;
  created_at: string;
  payment_intent_id: string;
  room: {
    name: string;
    images: string[];
  };
}

const MyBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select(`
          *,
          room:room_id (
            name,
            images
          )
        `)
        .eq('user_id', user?.id)
        .order('check_in', { ascending: true });

      if (fetchError) throw fetchError;
      setBookings(data as Booking[]);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      setCancellingBookingId(bookingId);
      
      // 1. Update booking status in Supabase
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (updateError) throw updateError;

      // 2. Find the booking to get payment intent ID and details
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking?.payment_intent_id) throw new Error('Payment intent not found');

      // Get user details for email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user?.id)
        .single();

      if (userError) throw userError;

      // 3. Request refund from server
      const response = await fetch('http://localhost:5001/api/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          paymentIntentId: booking.payment_intent_id,
          bookingDetails: {
            id: booking.id,
            name: userData.full_name,
            email: user?.email,
            roomName: booking.room.name,
            checkIn: booking.check_in,
            checkOut: booking.check_out,
            guests: booking.guests,
            totalPrice: booking.total_price
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process refund');
      }

      // 4. Refresh bookings list
      await fetchBookings();
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError('Failed to cancel booking. Please try again.');
    } finally {
      setCancellingBookingId(null);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600 mb-4">You don't have any bookings yet.</p>
            <Button onClick={() => navigate('/rooms')}>Browse Rooms</Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <Card key={booking.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{booking.room.name}</CardTitle>
                  <CardDescription>
                    Booking Reference: {booking.id.slice(0, 8)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Check-in:</span>{' '}
                      {new Date(booking.check_in).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Check-out:</span>{' '}
                      {new Date(booking.check_out).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Guests:</span> {booking.guests}
                    </div>
                    <div>
                      <span className="font-medium">Total:</span> CAD ${booking.total_price}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>{' '}
                      <span className={`capitalize ${
                        booking.status === 'confirmed' ? 'text-green-600' :
                        booking.status === 'cancelled' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="mt-auto">
                  {booking.status === 'confirmed' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="destructive" 
                          className="w-full"
                          disabled={cancellingBookingId === booking.id}
                        >
                          {cancellingBookingId === booking.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            'Cancel Booking'
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to cancel this booking? This action cannot be undone.
                            A refund will be processed to your original payment method.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleCancelBooking(booking.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Yes, Cancel Booking
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyBookings;
