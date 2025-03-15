import React, { useState } from 'react';
import RoomCard from '@/components/RoomCard';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Room } from '@/utils/data';
import Layout from '@/components/Layout';

// Sample room data - in a real app this would come from an API
const allRooms: Room[] = [
  {
    id: "1",
    name: 'Single Bedroom',
    description: 'Spacious room with king-sized bed',
    price: 125,
    capacity: 1,
    size: 40,
    images: ['/rooms/single_bedroom1.jpg'],
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'TV', 'Microwave', 'Refrigerator'],
    featured: false,
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
  },
  // {
  //   id: "3",
  //   name: 'Family Room',
  //   description: 'Spacious room perfect for families',
  //   price: 150,
  //   capacity: 2,
  //   size: 50,
  //   images: ['https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'],
  //   amenities: ['Free Wi-Fi', 'Breakfast', 'Air Conditioning', 'TV', 'Microwave', 'Refrigerator'],
  //   featured: false,
  //   status: 'available'
  // }
];

const Rooms = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter rooms based on search
  const filteredRooms = allRooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          room.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Our Rooms</h1>
        
        {/* Filters */}
        <div className="mb-10">
          <div className="max-w-xl">
            <h3 className="text-lg font-medium mb-2">Search Rooms</h3>
            <Input
              placeholder="Search by room name or features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        
        {/* Room listings */}
        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map(room => (
              <RoomCard 
                key={room.id} 
                room={room} 
                onClick={() => navigate(`/rooms/${room.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-medium mb-2">No rooms match your criteria</h3>
            <p className="text-muted-foreground">Try adjusting your search.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Rooms;
