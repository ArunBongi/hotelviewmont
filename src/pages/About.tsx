import React from 'react';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/Layout';

const About = () => {
  return (
    <Layout>
      <div className="px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">About Hotel Viewmont</h1>
          
          {/* Hero Section */}
          <div className="relative h-96 mb-16 rounded-lg overflow-hidden">
            <img 
              src="/hotelImages/Hotel_Image2.jpg" 
              alt="Hotel exterior" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="text-white text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">A Legacy of Luxury</h2>
                <p className="text-xl max-w-3xl mx-auto">Providing exceptional hospitality since 1995</p>
              </div>
            </div>
          </div>
          
          {/* Our Story */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-lg mb-4">
                  Hotel Viewmont was founded with a simple mission: to provide exceptional comfort and service to every guest. 
                  Since our establishment in 1995, we have been dedicated to creating memorable experiences for travelers from around the world.
                </p>
                <p className="text-lg">
                  What began as a single boutique hotel has grown into a collection of luxury accommodations, each maintaining our core values 
                  of personalized service, attention to detail, and creating a home away from home for our guests.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden">
                <img 
                  src="/hotelImages/Hotel_Image1.jpeg" 
                  alt="Hotel lobby" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
          
          <Separator className="mb-16" />
          
          {/* Our Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-10 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-card rounded-lg shadow-sm">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z" fill="currentColor" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Excellence</h3>
                <p>We strive for excellence in every detail, from room cleanliness to personalized service.</p>
              </div>
              
              <div className="text-center p-6 bg-card rounded-lg shadow-sm">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="currentColor" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Hospitality</h3>
                <p>We believe in creating a warm, welcoming environment where every guest feels special.</p>
              </div>
              
              <div className="text-center p-6 bg-card rounded-lg shadow-sm">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V18H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V18H23V16.5C23 14.17 18.33 13 16 13Z" fill="currentColor" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Community</h3>
                <p>We value our place in the local community and strive to make a positive impact.</p>
              </div>
            </div>
          </div>
          
          <Separator className="mb-16" />
          
          {/* Leadership Team */}
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Our Leadership Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="mb-6">
                    <img
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                      alt="CEO"
                      className="w-48 h-48 rounded-full mx-auto object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Harbant</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Chief Executive Officer</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    With over 20 years of experience in luxury hospitality,
                    Harbant leads our team with passion and innovation.
                  </p>
                </div>

                <div className="text-center">
                  <div className="mb-6">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"
                      alt="Manager"
                      className="w-48 h-48 rounded-full mx-auto object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Kunal Grover</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">General Manager</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    With extensive experience in hospitality management,
                    Kunal ensures exceptional service and memorable experiences for all guests.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          <Separator className="mb-16" />
          
          {/* Our Team */}
          <div className="text-center mt-16">
          <h2 className="text-3xl font-bold mb-10 text-center">Meet Our Culinary Expert</h2>
            <div className="w-48 h-48 rounded-full overflow-hidden mx-auto mb-4">
              <img 
                src="https://images.unsplash.com/photo-1531561855568-3036cd4f03ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                alt="Culinary Expert" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold">Zeke</h3>
            <p className="text-muted-foreground">Executive Chef</p>
          </div>
          <div className="text-center mt-16">
            <h2 className="text-3xl font-bold mb-6">Meet Our Tech Lead</h2>
            <div className="w-48 h-48 rounded-full overflow-hidden mx-auto mb-4">
              <img 
                src="/People_images/Arun.jpg" 
                alt="Tech Lead" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold">Arun</h3>
            <p className="text-muted-foreground">Software Engineer & UI/UX Designer</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
