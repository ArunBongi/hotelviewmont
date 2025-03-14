import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { getCurrentUser } from '@/lib/supabase';
import { rooms, Room } from '@/utils/data';

const RoomDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const room = rooms.find(r => r.id === id);
    if (!room) {
      navigate('/rooms');
      return;
    }
    setRoom(room);

    const checkAuth = async () => {
      const user = await getCurrentUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, [id, navigate]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/rooms/${id}` } });
      return;
    }
    navigate(`/book/${id}`);
  };

  if (!room) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Carousel className="w-full">
            <CarouselContent>
              {room.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-video overflow-hidden rounded-lg">
                    <img
                      src={image}
                      alt={`${room.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{room.name}</h1>
            <p className="text-2xl font-semibold text-primary mt-2">
              ${room.price} <span className="text-sm text-gray-600">per night</span>
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Room Details</h2>
            <div className="flex gap-4">
              <Badge variant="outline">{room.size} sq ft</Badge>
              <Badge variant="outline">Up to {room.capacity} guests</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="text-gray-600">{room.description}</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Amenities</h2>
            <div className="grid grid-cols-2 gap-2">
              {room.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-primary"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <Button
                className="w-full"
                size="lg"
                onClick={handleBookNow}
              >
                {isAuthenticated ? 'Book Now' : 'Sign in to Book'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails; 