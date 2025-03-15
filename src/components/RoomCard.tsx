import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Room } from '@/utils/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronRight, Users, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

interface RoomCardProps {
  room: Room;
  featured?: boolean;
}

const RoomCard = ({ room, featured = false }: RoomCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [imageIndex, setImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  useEffect(() => {
    if (!isHovered) return;
    
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % room.images.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isHovered, room.images.length]);

  const handleBookNow = () => {
    if (!user) {
      navigate('/login', { 
        state: { 
          from: `/rooms/${room.id}`,
          message: 'Please log in to book a room'
        } 
      });
      return;
    }

    // Navigate directly to booking summary if user is logged in
    navigate('/booking-summary', {
      state: {
        bookingDetails: {
          roomId: room.id,
          roomName: room.name,
          checkInDate: new Date().toISOString(),
          checkOutDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
          guests: 1,
          numberOfNights: 1,
          pricePerNight: room.price,
          totalPrice: room.price
        }
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        className={`overflow-hidden group transition-all duration-300 hover:shadow-2xl hover-lift glass-card ${
          featured ? 'md:col-span-2 md:row-span-2' : ''
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative overflow-hidden aspect-[16/9]">
          {/* Room image */}
          <motion.div 
            className="absolute inset-0 bg-cover bg-center"
            initial={false}
            animate={{ 
              scale: isHovered ? 1.05 : 1,
              filter: isHovered ? 'brightness(1.1)' : 'brightness(1)'
            }}
            transition={{ duration: 0.4 }}
            style={{ backgroundImage: `url(${room.images[imageIndex]})` }}
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Badge for featured rooms */}
          {featured && (
            <Badge className="absolute top-4 left-4 bg-accent text-black font-medium z-10">
              Featured
            </Badge>
          )}
          
          {/* Price badge */}
          <div className="absolute bottom-4 left-4 bg-white dark:bg-black/90 backdrop-blur-md p-3 rounded-lg shadow-lg z-10">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              <span className="text-xl font-bold text-accent">${room.price}</span>
              <span className="ml-1 text-xs">/night</span>
            </p>
          </div>
          
          {/* Image pagination dots */}
          {room.images.length > 1 && (
            <div className="absolute bottom-4 right-4 flex gap-2">
              {room.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    setImageIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === imageIndex 
                      ? 'w-6 bg-accent' 
                      : 'w-4 bg-white/60 hover:bg-white/90'
                  }`}
                  aria-label={`View image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold tracking-tight text-gradient">
              {room.name}
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {room.description}
            </p>
            
            <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-primary" />
                <span>{room.capacity} Guests</span>
              </div>
              <div className="flex items-center gap-2">
                <Square size={18} className="text-primary" />
                <span>{room.size} m²</span>
              </div>
            </div>
            
            <div className="pt-2 grid grid-cols-2 gap-3">
              {room.amenities.slice(0, 4).map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <Check size={16} className="text-accent" />
                  <span className="text-gray-700 dark:text-gray-300">{amenity}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-4 flex justify-between items-center">
              <Link to={`/rooms/${room.id}`}>
                <Button
                  variant="ghost"
                  className="p-0 h-auto text-[#722F37] hover:text-[#722F37]/80 hover:bg-transparent btn-hover-effect"
                >
                  View Details
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              </Link>
              
              <Button
                onClick={handleBookNow}
                variant="outline"
                className="bg-[#722F37] text-white hover:bg-transparent hover:text-[#722F37] hover:border-[#722F37] transition-colors"
              >
                Book Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RoomCard;
