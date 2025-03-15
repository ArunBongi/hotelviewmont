import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Layout from '@/components/Layout';
import { PaymentForm } from '@/components/payment/PaymentForm';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState('');

  const bookingDetails = location.state?.bookingDetails;

  useEffect(() => {
    if (!bookingDetails) {
      navigate('/rooms');
      return;
    }

    // Create PaymentIntent on component mount
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: bookingDetails.totalPrice * 100, // Convert to cents
            currency: 'cad',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create payment intent');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to initialize payment. Please try again.",
        });
      }
    };

    createPaymentIntent();
  }, [bookingDetails, navigate, toast]);

  const handlePaymentSuccess = async (paymentIntent: any) => {
    try {
      // Update booking status in your database
      // Navigate to confirmation page
      navigate('/booking-confirmation', {
        state: {
          bookingData: bookingDetails,
          paymentMethod: 'credit-card',
          confirmationNumber: `HV-${Date.now().toString().slice(-6)}`,
        },
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process booking. Please contact support.",
      });
    }
  };

  if (!bookingDetails || !clientSecret) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Booking Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
                <CardDescription>Review your booking details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Room Details</h3>
                    <p>{bookingDetails.roomName}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Check-in</h3>
                    <p>{new Date(bookingDetails.checkIn).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Check-out</h3>
                    <p>{new Date(bookingDetails.checkOut).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Guests</h3>
                    <p>{bookingDetails.guests} {bookingDetails.guests === 1 ? 'guest' : 'guests'}</p>
                  </div>
                </div>
              </CardContent>
              <Separator className="my-4" />
              <CardFooter>
                <div className="w-full">
                  <div className="flex justify-between items-center mb-2">
                    <span>Total Amount</span>
                    <span className="text-2xl font-bold">CAD ${bookingDetails.totalPrice}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Includes taxes and fees
                  </p>
                </div>
              </CardFooter>
            </Card>

            {/* Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>Enter your payment information securely</CardDescription>
              </CardHeader>
              <CardContent>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <PaymentForm
                    amount={bookingDetails.totalPrice}
                    onSuccess={handlePaymentSuccess}
                  />
                </Elements>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Payment; 