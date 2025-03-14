
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Import our new components
import { PaymentMethodSelector } from '@/components/payment/PaymentMethodSelector';
import { CreditCardForm } from '@/components/payment/CreditCardForm';
import { BankTransferInfo } from '@/components/payment/BankTransferInfo';
import { PayAtHotelInfo } from '@/components/payment/PayAtHotelInfo';
import { SpecialRequestsInput } from '@/components/payment/SpecialRequestsInput';
import { BookingSummary } from '@/components/payment/BookingSummary';

const BookingPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  
  // Mock booking data (in a real app, this would come from previous steps or context)
  const bookingData = location.state?.bookingData || {
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
  };

  // Form state
  const [cardholderName, setCardholderName] = useState(user?.name || '');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [savePaymentInfo, setSavePaymentInfo] = useState(false);
  const [billingAddress, setBillingAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate processing payment
    setTimeout(() => {
      toast({
        title: "Payment Successful",
        description: "Your booking has been confirmed. Check your email for details.",
      });
      
      navigate('/booking-confirmation', { 
        state: { 
          bookingData: {
            ...bookingData,
            grandTotal: promoApplied ? bookingData.grandTotal - discountAmount : bookingData.grandTotal,
            discountAmount: discountAmount
          },
          paymentMethod,
          specialRequests,
          confirmationNumber: `HV-${Math.floor(100000 + Math.random() * 900000)}`
        } 
      });
      
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Complete Your Booking</h1>
        
        {!user && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Attention</AlertTitle>
            <AlertDescription>
              You are not logged in. Your booking will be processed, but to manage your bookings in the future, we recommend <Link to="/login" className="font-medium underline">logging in</Link> or <Link to="/signup" className="font-medium underline">creating an account</Link>.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Payment Details</CardTitle>
                <CardDescription>Complete your booking by providing payment information</CardDescription>
              </CardHeader>
              
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <PaymentMethodSelector 
                      paymentMethod={paymentMethod}
                      onPaymentMethodChange={setPaymentMethod}
                    />
                      
                    {paymentMethod === 'credit-card' && (
                      <CreditCardForm
                        cardholderName={cardholderName}
                        setCardholderName={setCardholderName}
                        cardNumber={cardNumber}
                        setCardNumber={setCardNumber}
                        expiryDate={expiryDate}
                        setExpiryDate={setExpiryDate}
                        cvv={cvv}
                        setCvv={setCvv}
                        billingAddress={billingAddress}
                        setBillingAddress={setBillingAddress}
                        city={city}
                        setCity={setCity}
                        zipCode={zipCode}
                        setZipCode={setZipCode}
                        country={country}
                        setCountry={setCountry}
                        savePaymentInfo={savePaymentInfo}
                        setSavePaymentInfo={setSavePaymentInfo}
                      />
                    )}
                    
                    {paymentMethod === 'bank-transfer' && <BankTransferInfo />}
                    
                    {paymentMethod === 'pay-at-hotel' && <PayAtHotelInfo />}
                    
                    <SpecialRequestsInput
                      specialRequests={specialRequests}
                      setSpecialRequests={setSpecialRequests}
                    />
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting 
                      ? 'Processing Payment...' 
                      : paymentMethod === 'pay-at-hotel' 
                        ? 'Confirm Booking' 
                        : 'Complete Payment'
                    }
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
          
          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <BookingSummary 
                  bookingData={bookingData}
                  promoCode={promoCode}
                  setPromoCode={setPromoCode}
                  promoApplied={promoApplied}
                  setPromoApplied={setPromoApplied}
                  discountAmount={discountAmount}
                  setDiscountAmount={setDiscountAmount}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BookingPayment;
