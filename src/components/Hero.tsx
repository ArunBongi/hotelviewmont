import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    image: '/hotelImages/Hotel_Image1.jpeg',
    title: 'Experience Luxury at Hotel Viewmont',
    subtitle: 'Discover comfort, elegance, and exceptional service in the heart of the city.'
  },
  {
    image: '/hotelImages/Hotel_Image2.jpg',
    title: 'Your Perfect Getaway',
    subtitle: 'Relax in our beautifully designed rooms with stunning views.'
  },
  {
    image: '/hotelImages/Hotel_Image3.jpg',
    title: 'Business & Leisure',
    subtitle: 'Modern amenities and professional services for both business and leisure travelers.'
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[80vh] overflow-hidden">
      {slides.map((slide, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: currentSlide === index ? 1 : 0,
            scale: currentSlide === index ? 1 : 1.1
          }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
          style={{
            zIndex: currentSlide === index ? 1 : 0
          }}
        >
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <div className="container relative z-10 mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: currentSlide === index ? 0 : 20, opacity: currentSlide === index ? 1 : 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
              >
                {slide.title}
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: currentSlide === index ? 0 : 20, opacity: currentSlide === index ? 1 : 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-xl text-white/90 mb-8"
              >
                {slide.subtitle}
              </motion.p>
              <Button
                onClick={() => navigate('/rooms')}
                size="lg"
                variant="outline"
                className="bg-[#722F37] text-white hover:bg-white hover:text-[#722F37] hover:border-[#722F37] transition-colors"
              >
                View Our Rooms
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
      
      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'bg-white w-6' : 'bg-white/50'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
