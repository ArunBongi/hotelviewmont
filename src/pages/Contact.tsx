import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Layout from '@/components/Layout';

const Contact = () => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would send the form data to an API
    toast({
      title: "Message Sent",
      description: "Thank you for your message. We'll get back to you soon!",
    });
    
    // Reset the form
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Layout>
      <div className="px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Contact Form */}
            <div className="bg-card rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                    <Input id="name" placeholder="Your name" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input id="email" type="email" placeholder="Your email" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                  <Input id="subject" placeholder="Subject of your message" required />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <Textarea id="message" placeholder="Your message" rows={5} required />
                </div>
                
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            </div>
            
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Address</h3>
                    <p className="text-muted-foreground">19 Apex Dr</p>
                    <p className="text-muted-foreground">Logan Lake, BC V0K 1W0</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Phone className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Phone</h3>
                    <p className="text-muted-foreground">+1 (250)299-9019</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mail className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Email</h3>
                    <p className="text-muted-foreground">viewmonthotel@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Clock className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Opening Hours</h3>
                    <p className="text-muted-foreground">Reception: 24/7</p>
                    <p className="text-muted-foreground">Restaurant: 6:30 AM - 10:30 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Map */}
          <div className="rounded-lg overflow-hidden h-96 mb-16">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2524.8887896167147!2d-120.81090542402344!3d50.49121897159707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54807d2654d6ca75%3A0x4673a9d7a1abb97f!2s19%20Apex%20Dr%2C%20Logan%20Lake%2C%20BC%20V0K%201W0%2C%20Canada!5e0!3m2!1sen!2sus!4v1710728169774!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Hotel Location"
            ></iframe>
          </div>
          
          {/* FAQ Section */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">What are the check-in and check-out times?</h3>
                <p className="text-muted-foreground">Check-in time is 11:00 AM and check-out time is 10:00 AM.</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Is there a shuttle service from the airport?</h3>
                <p className="text-muted-foreground">Yes, we offer a complimentary shuttle service to and from Kamloops Airport.</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Do you allow pets?</h3>
                <p className="text-muted-foreground">We are pet-friendly and allow dogs up to 40 pounds for an additional fee of $30 per night.</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Is breakfast included?</h3>
                <p className="text-muted-foreground">Breakfast is included with certain room packages. Please check the details of your reservation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
