import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { rooms } from '@/utils/data';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface Booking {
  id: string;
  room_id: string;
  user_id: string;
  check_in_date: string;
  check_out_date: string;
  guests: number;
  total_price: number;
  created_at: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  guest_name: string;
  guest_email: string;
  special_requests?: string;
}

const MyBookings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        navigate('/login', { 
          state: { 
            from: '/my-bookings',
            message: 'Please log in to view your bookings'
          } 
        });
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        // Even if there are no bookings, data will be an empty array
        setBookings(data || []);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        // // Don't show error if we have bookings data
        // if (bookings.length === 0) {
        //   setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
        // }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [navigate, user]);

  const getRoomDetails = (roomId: string) => {
    const room = rooms.find(room => room.id === roomId);
    if (!room) {
      console.warn(`Room not found for ID: ${roomId}`);
      return {
        name: 'Unknown Room',
        price: 0,
        capacity: 1
      };
    }
    return room;
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      );
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError(err instanceof Error ? err.message : 'Failed to cancel booking');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="text-center py-8">Loading your bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">You don't have any bookings yet.</p>
            <Button onClick={() => navigate('/rooms')}>Browse Rooms</Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map(booking => {
              const room = getRoomDetails(booking.room_id);

              return (
                <Card key={booking.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{room.name}</span>
                      <span className={cn(
                        "text-sm px-3 py-1 rounded-full",
                        booking.status === 'confirmed' && "bg-green-100 text-green-800",
                        booking.status === 'pending' && "bg-yellow-100 text-yellow-800",
                        booking.status === 'cancelled' && "bg-red-100 text-red-800"
                      )}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Check-in Date</p>
                        <p>{format(new Date(booking.check_in_date), 'PPP')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Check-out Date</p>
                        <p>{format(new Date(booking.check_out_date), 'PPP')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Guests</p>
                        <p>{booking.guests}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Price</p>
                        <p>${booking.total_price}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Booked On</p>
                        <p>{format(new Date(booking.created_at), 'PPP')}</p>
                      </div>
                    </div>

                    {booking.status !== 'cancelled' && (
                      <Button
                        variant="destructive"
                        className="mt-4"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Cancel Booking
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyBookings;
