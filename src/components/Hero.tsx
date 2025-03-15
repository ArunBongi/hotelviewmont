import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/animations';
import { motion } from 'framer-motion';

interface HeroProps {
  className?: string;
}

const Hero = ({ className }: HeroProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: '/hotelImages/Hotel_Image1.jpeg',
      title: 'Welcome to Luxury & Comfort',
      subtitle: 'Experience exceptional hospitality in the heart of the city'
    },
    {
      image: '/hotelImages/Hotel_Image2.jpg',
      title: 'Modern Elegance',
      subtitle: 'Where contemporary design meets timeless sophistication'
    },
    {
      image: '/hotelImages/Hotel_Image4.jpg',
      title: 'Your Perfect Escape',
      subtitle: 'Discover a sanctuary of peace and relaxation'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className={cn("relative w-full h-[90vh] overflow-hidden", className)}>
      {/* Slides */}
      {slides.map((slide, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: index === currentSlide ? 1 : 0,
            scale: index === currentSlide ? 1.05 : 1
          }}
          transition={{ 
            opacity: { duration: 1 },
            scale: { duration: 6 }
          }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${slide.image})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 z-10">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight drop-shadow-lg mb-6">
            {slides[currentSlide].title}
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-white/90 max-w-3xl mx-auto drop-shadow-lg font-light mb-12">
            {slides[currentSlide].subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/rooms">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-medium text-lg px-8 py-7 h-auto rounded-full shadow-lg hover:shadow-xl transition-all">
                View Our Rooms
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'w-12 bg-primary' 
                : 'w-6 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
