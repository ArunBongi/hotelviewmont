
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Calendar, Users, CreditCard, Clock, MapPin, Phone, Mail, Printer } from 'lucide-react';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get booking data from location state or use default data
  const { bookingData, paymentMethod, confirmationNumber } = location.state || {
    bookingData: {
      roomId: "1",
      roomName: "Deluxe King Room",
      checkIn: "2023-12-15",
      checkOut: "2023-12-18",
      guests: 2,
      nights: 3,
      roomPrice: 199,
      totalPrice: 597,
      taxes: 59.7,
      grandTotal: 656.7
    },
    paymentMethod: 'credit-card',
    confirmationNumber: 'HV-123456'
  };
  
  // Format dates for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const getPaymentMethodText = () => {
    switch(paymentMethod) {
      case 'credit-card':
        return 'Credit Card';
      case 'bank-transfer':
        return 'Bank Transfer';
      case 'pay-at-hotel':
        return 'Pay at Hotel';
      default:
        return 'Online Payment';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 px-4 md:px-8 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
          <p className="text-muted-foreground mt-2">
            Your reservation has been successfully confirmed. We've sent the details to your email.
          </p>
        </div>
        
        <Card className="mb-8 print:shadow-none">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <CardTitle>Booking Details</CardTitle>
              <span className="text-sm font-medium">Confirmation #{confirmationNumber}</span>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg">{bookingData.roomName}</h3>
                <div className="mt-4 space-y-3">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                    <div>
                      <div className="font-medium">Check-in</div>
                      <div>{formatDate(bookingData.checkIn)}</div>
                      <div className="text-sm text-muted-foreground">From 3:00 PM</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                    <div>
                      <div className="font-medium">Check-out</div>
                      <div>{formatDate(bookingData.checkOut)}</div>
                      <div className="text-sm text-muted-foreground">Until 11:00 AM</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <span className="font-medium">Duration:</span> {bookingData.nights} nights
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <span className="font-medium">Guests:</span> {bookingData.guests}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg">Payment Information</h3>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <span className="font-medium">Payment Method:</span> {getPaymentMethodText()}
                    </div>
                  </div>
                  
                  {paymentMethod === 'pay-at-hotel' ? (
                    <div className="text-sm bg-amber-50 border border-amber-200 p-3 rounded">
                      Payment will be collected at the hotel during check-in.
                    </div>
                  ) : (
                    <div className="text-sm bg-green-50 border border-green-200 p-3 rounded">
                      Your payment has been successfully processed.
                    </div>
                  )}
                  
                  <Separator className="my-3" />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Room Rate ({bookingData.nights} nights)</span>
                      <span>${bookingData.totalPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes & Fees (10%)</span>
                      <span>${bookingData.taxes}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold">
                      <span>Total Amount</span>
                      <span>${bookingData.grandTotal}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Hotel Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium">Address</div>
                    <div className="text-sm">123 Mountain View Rd</div>
                    <div className="text-sm">Viewmont, CA 94123</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium">Phone</div>
                    <div className="text-sm">+1 (555) 123-4567</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-sm">info@hotelviewmont.com</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center print:hidden">
          <Button onClick={handlePrint} variant="outline" className="flex items-center">
            <Printer className="mr-2 h-4 w-4" />
            Print Confirmation
          </Button>
          <Button onClick={() => navigate('/my-bookings')}>
            View All Bookings
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BookingConfirmation;
