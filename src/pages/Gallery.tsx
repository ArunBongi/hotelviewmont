import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const galleryImages = [
  {
    id: 1,
    src: '/hotelImages/Hotel_Image2.jpg',
    alt: 'Hotel Viewmont Exterior',
    category: 'Exterior'
  },
  {
    id: 2,
    src: '/hotelImages/Hotel_Image4.jpg',
    alt: 'Hotel Viewmont Exterior',
    category: 'Exterior'
  },
  {
    id: 3,
    src: '/hotelImages/Hotel_Image1.jpeg',
    alt: 'Hotel Lobby',
    category: 'Interior'
  },
  {
    id: 4,
    src: '/rooms/single_bedroom1.jpg',
    alt: 'Single bedroom',
    category: 'Rooms'
  },
  {
    id: 5,
    src: '/rooms/single_bedroom2.jpg',
    alt: 'Single bedroom',
    category: 'Rooms'
  },
  {
    id: 6,
    src: '/rooms/double_bedroom2.jpeg',
    alt: 'Double bedroom',
    category: 'Rooms'
  },
  {
    id: 7,
    src: '/rooms/double_bedroom1.jpeg',
    alt: 'Double Bedroom',
    category: 'Rooms'
  },
  {
    id: 8,
    src: '/rooms/bathroom1.jpg',
    alt: 'Bathroom',
    category: 'Rooms'
  },
  {
    id: 9,
    src: '/rooms/bathroom2.jpeg',
    alt: 'Bathroom',
    category: 'Rooms'
  },
  {
    id: 10,
    src: '/rooms/wash_area.jpeg',
    alt: 'Wash Area',
    category: 'Rooms'
  },
  {
    id: 11,
    src: '/rooms/wash_area2.jpeg',
    alt: 'Wash Area',
    category: 'Rooms'
  },
  {
    id: 12,
    src: '/rooms/wash_area3.jpeg',
    alt: 'Wash Area',
    category: 'Rooms'
  },


  {
    id: 13,
    src: '/hotelImages/breakfast_area.jpeg',
    alt: 'Breakfast Area',
    category: 'Amenities'
  },
  {
    id: 14,
    src: '/hotelImages/Hotel_Image3.jpg',
    alt: 'Reception',
    category: 'Business'
  }
];

const categories = ['All', 'Exterior', 'Interior', 'Rooms', 'Amenities', 'Business'];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filteredImages = selectedCategory === 'All'
    ? galleryImages
    : galleryImages.filter(image => image.category === selectedCategory);

  const handlePrevious = () => {
    if (selectedImage === null) return;
    setSelectedImage(selectedImage === 0 ? filteredImages.length - 1 : selectedImage - 1);
  };

  const handleNext = () => {
    if (selectedImage === null) return;
    setSelectedImage(selectedImage === filteredImages.length - 1 ? 0 : selectedImage + 1);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') setSelectedImage(null);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Hotel Gallery</h1>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "ghost"}
              className={selectedCategory === category 
                ? "bg-[#722F37] text-white hover:bg-[#722F37]/90 border-2 border-[#722F37]" 
                : "text-[#722F37] hover:bg-[#722F37]/10 border-2 border-[#722F37]/30 hover:border-[#722F37] transition-colors"}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image, index) => (
            <div 
              key={image.id} 
              className="group relative overflow-hidden rounded-lg cursor-pointer"
              onClick={() => setSelectedImage(index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-4">
                  Click to view {image.alt}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Image Modal */}
        <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-[90vw] h-[90vh] p-0 bg-black/90">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white hover:bg-white/20"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Navigation buttons */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 text-white hover:bg-white/20"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 text-white hover:bg-white/20"
                onClick={handleNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>

              {/* Image */}
              {selectedImage !== null && (
                <img
                  src={filteredImages[selectedImage].src}
                  alt={filteredImages[selectedImage].alt}
                  className="max-h-full max-w-full object-contain"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Gallery; 