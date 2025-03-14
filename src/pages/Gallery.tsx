import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';

const galleryImages = [
  {
    id: 1,
    src: '../../public/hotelImages/Hotel_Image2.jpg',
    alt: 'Hotel Viewmont Exterior',
    category: 'Exterior'
  },
  {
    id: 2,
    src: '../../public/hotelImages/Hotel_Image4.jpg',
    alt: 'Hotel Viewmont Exterior',
    category: 'Exterior'
  },
  {
    id: 3,
    src: '../../public/hotelImages/Hotel_Image1.jpeg',
    alt: 'Hotel Lobby',
    category: 'Interior'
  },
  {
    id: 4,
    src: '../../public/rooms/single_bedroom1.jpg',
    alt: 'Single bedroom',
    category: 'Rooms'
  },
  {
    id: 5,
    src: '../../public/rooms/single_bedroom2.jpg',
    alt: 'Single bedroom',
    category: 'Rooms'
  },
  {
    id: 6,
    src: '../../public/rooms/double_bedroom2.jpeg',
    alt: 'Double bedroom',
    category: 'Rooms'
  },
  {
    id: 7,
    src: '../../public/rooms/double_bedroom1.jpeg',
    alt: 'Double Bedroom',
    category: 'Rooms'
  },
  {
    id: 8,
    src: '../../public/rooms/bathroom1.jpg',
    alt: 'Bathroom',
    category: 'Rooms'
  },
  {
    id: 9,
    src: '../../public/rooms/bathroom2.jpeg',
    alt: 'Bathroom',
    category: 'Rooms'
  },
  {
    id: 10,
    src: '../../public/rooms/wash_area.jpeg',
    alt: 'Wash Area',
    category: 'Rooms'
  },
  {
    id: 11,
    src: '../../public/rooms/wash_area2.jpeg',
    alt: 'Wash Area',
    category: 'Rooms'
  },
  {
    id: 12,
    src: '../../public/rooms/wash_area3.jpeg',
    alt: 'Wash Area',
    category: 'Rooms'
  },


  {
    id: 13,
    src: '../../public/hotelImages/breakfast_area.jpeg',
    alt: 'Breakfast Area',
    category: 'Amenities'
  },
  {
    id: 14,
    src: '../../public/hotelImages/Hotel_Image3.jpg',
    alt: 'Reception',
    category: 'Business'
  }
];

const categories = ['All', 'Exterior', 'Interior', 'Rooms', 'Amenities', 'Business'];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredImages = selectedCategory === 'All'
    ? galleryImages
    : galleryImages.filter(image => image.category === selectedCategory);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Hotel Gallery</h1>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map(image => (
            <div key={image.id} className="group relative overflow-hidden rounded-lg">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {image.alt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Gallery; 