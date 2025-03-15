import React, { useState } from 'react';
import Hero from '@/components/Hero';
import RoomCard from '@/components/RoomCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Room } from '@/utils/data';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { featuredRooms } from '@/utils/data';
import emailjs from '@emailjs/browser';
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await emailjs.send(
        'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
        'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: 'viewmonthotel@gmail.com'
        },
        'YOUR_PUBLIC_KEY' // Replace with your EmailJS public key
      );

      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
      });

      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <Layout>
      {/* Hero Section */}
      <Hero />

      {/* Featured Rooms */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Rooms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onClick={() => navigate(`/rooms/${room.id}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-600 mb-8">
              Subscribe to our newsletter for exclusive offers and updates.
            </p>
            <form className="flex flex-col md:flex-row gap-4 justify-center">
              <Input
                type="email"
                placeholder="Enter your email"
                className="md:w-96"
              />
              <Button 
                type="submit"
                variant="outline"
                className="w-full md:w-auto bg-[#722F37] text-white hover:bg-transparent hover:text-[#722F37] hover:border-[#722F37] transition-colors"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <Input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name" 
                      required 
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Your email" 
                      required 
                    />
                  </div>
                  <div>
                    <Label>Message</Label>
                    <Textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Your message" 
                      className="h-32" 
                      required 
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full md:w-auto bg-[#722F37] text-white hover:bg-transparent hover:text-[#722F37] hover:border-[#722F37] transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Address</h3>
                  <p className="text-gray-600">19 Apex Dr, Logan Lake, BC V0K 1W0</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <p className="text-gray-600">+1 (250) 299-9019</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-gray-600">viewmonthotel@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
