import React from 'react';
import Hero from '@/components/Hero';
import RoomCard from '@/components/RoomCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Room } from '@/utils/data';

const Index = () => {
  const navigate = useNavigate();
  
  // Sample room data using the Room interface
  const featuredRooms: Room[] = [
    {
      id: "1",
      name: 'Single Bedroom',
      description: 'Spacious room with king-sized bed and city view',
      price: 125,
      capacity: 2,
      size: 40,
      images: ['/rooms/single_bedroom1.jpg'],
      amenities: ['Free Wi-Fi', 'Air Conditioning', 'TV', 'Microwave', 'Refrigerator'],
      featured: true,
      status: 'available'
    },
    {
      id: "2",
      name: 'Standard Twin Room',
      description: 'Comfortable room with two twin beds',
      price: 145,
      capacity: 2,
      size: 45,
      images: ['/rooms/double_bedroom1.jpeg'],
      amenities: ['Free Wi-Fi', 'Breakfast','Air Conditioning', 'TV', 'Microwave', 'Refrigerator'],
      featured: false,
      status: 'available'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        {/* Featured Rooms Section */}
        <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Rooms</h2>
            <Button 
              variant="outline" 
              onClick={() => navigate('/rooms')}
              className="flex items-center gap-2"
            >
              View All Rooms <ArrowRight size={16} />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRooms.map(room => (
              <RoomCard 
                key={room.id} 
                room={room} 
                onClick={() => navigate(`/rooms/${room.id}`)}
              />
            ))}
          </div>
        </section>
        
        {/* About Section */}
        <section className="py-16 px-4 md:px-8 bg-muted">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">About Our Hotel</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-lg mb-4">
                  Welcome to HotelBookeroo, where luxury meets comfort. Our hotel offers a unique blend of modern amenities and traditional hospitality.
                </p>
                <p className="text-lg mb-4">
                  Located in the heart of the city, we provide easy access to major attractions while ensuring a peaceful stay for our guests.
                </p>
                <Button onClick={() => navigate('/about')}>Learn More</Button>
              </div>
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="/hotelImages/Hotel_Image2.jpg" 
                  alt="Hotel Exterior" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
