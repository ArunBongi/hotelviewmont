import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Layout from '@/components/Layout';
import { PaymentForm } from '@/components/payment/PaymentForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Payment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Hardcoded test booking details
  const testBookingDetails = {
    totalPrice: 100, // $100 for testing
    name: "Test User",
    email: "test@example.com",
    roomId: "test-room",
    roomName: "Test Room",
    checkIn: new Date().toISOString(),
    checkOut: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    guests: 2,
    nights: 1,
    pricePerNight: 100,
    subtotal: 100,
    tax: 5,
    specialRequests: "None"
  };

  useEffect(() => {
    // Create PaymentIntent on component mount
    const createPaymentIntent = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: testBookingDetails.totalPrice,
            currency: 'cad',
            bookingDetails: testBookingDetails
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create payment intent');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Payment initialization error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to initialize payment. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [toast]);

  const handlePaymentSuccess = async (paymentIntent: any) => {
    try {
      // Navigate to a success page
      navigate('/booking-confirmation', {
        state: {
          bookingData: testBookingDetails,
          paymentMethod: 'credit-card',
          confirmationNumber: `HV-${Date.now().toString().slice(-6)}`,
        },
      });
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process booking. Please contact support.",
      });
    }
  };

  if (!clientSecret && !isLoading) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Test Payment Page</h1>
          
          <div className="grid grid-cols-1 gap-8">
            {/* Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>Enter your payment information securely</CardDescription>
              </CardHeader>
              <CardContent>
                {clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm
                      amount={testBookingDetails.totalPrice}
                      onSuccess={handlePaymentSuccess}
                    />
                  </Elements>
                )}
                {isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Payment; 