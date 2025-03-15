import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PaymentFormProps {
  amount: number;
  onSuccess: (paymentIntent: any) => void;
}

export const PaymentForm = ({ amount, onSuccess }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: submitError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking-confirmation`,
        },
        redirect: 'if_required',
      });

      if (submitError) {
        setError(submitError.message || 'Payment failed. Please try again.');
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <PaymentElement />

      <Button
        type="submit"
        className="w-full"
        disabled={!stripe || processing}
      >
        {processing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </Button>

      <p className="text-sm text-muted-foreground text-center">
        Your payment is secure and encrypted
      </p>
    </form>
  );
}; 