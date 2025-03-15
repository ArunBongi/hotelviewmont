import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia', // Latest supported API version
});

export const createPaymentIntent = async (amount: number) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  } catch (err) {
    console.error('Error creating payment intent:', err);
    throw new Error('Failed to create payment intent');
  }
}; 