import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { rooms, Room } from '@/utils/data';
import { supabase } from '@/lib/supabase';

const BookRoom = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>();
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    const room = rooms.find(r => r.id === id);
    if (!room) {
      navigate('/rooms');
      return;
    }
    setRoom(room);
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !room) return;

    setError(null);
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login', { state: { from: `/book/${id}` } });
        return;
      }

      const { error: bookingError } = await supabase
        .from('bookings')
        .insert([
          {
            user_id: user.id,
            room_id: room.id,
            check_in_date: format(date, 'yyyy-MM-dd'),
            guests: guests,
            total_price: room.price,
            status: 'pending'
          }
        ]);

      if (bookingError) throw bookingError;

      navigate('/my-bookings', {
        state: { message: 'Booking successful! Check your email for confirmation.' }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setIsLoading(false);
    }
  };

  if (!room) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Book {room.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="guests">Number of Guests</Label>
                <Input
                  id="guests"
                  type="number"
                  min={1}
                  max={room.capacity}
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                />
                <p className="text-sm text-muted-foreground">
                  Maximum capacity: {room.capacity} guests
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Price Summary</h3>
                <div className="flex justify-between">
                  <span>Room Rate</span>
                  <span>${room.price}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${room.price}</span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!date || isLoading}
              >
                {isLoading ? 'Processing...' : 'Confirm Booking'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookRoom; 