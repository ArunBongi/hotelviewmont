import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

app.use(cors());
app.use(express.json());

// Function to send confirmation emails
async function sendConfirmationEmails(bookingDetails, paymentIntent) {
  // Email to guest
  const guestEmail = {
    from: process.env.EMAIL_USER,
    to: bookingDetails.email,
    subject: 'Booking Confirmation - Hotel Viewmont',
    html: `
      <h1>Booking Confirmation</h1>
      <p>Dear ${bookingDetails.name},</p>
      <p>Thank you for choosing Hotel Viewmont. Your booking has been confirmed.</p>
      <h2>Booking Details:</h2>
      <ul>
        <li>Room: ${bookingDetails.roomName}</li>
        <li>Check-in: ${new Date(bookingDetails.checkIn).toLocaleDateString()}</li>
        <li>Check-out: ${new Date(bookingDetails.checkOut).toLocaleDateString()}</li>
        <li>Guests: ${bookingDetails.guests}</li>
        <li>Total Amount: CAD $${bookingDetails.totalPrice}</li>
        <li>Booking Reference: ${paymentIntent.id}</li>
      </ul>
      <p>We look forward to welcoming you!</p>
    `
  };

  // Email to hotel
  const hotelEmail = {
    from: process.env.EMAIL_USER,
    to: process.env.HOTEL_EMAIL,
    subject: 'New Booking Notification',
    html: `
      <h1>New Booking Received</h1>
      <h2>Guest Information:</h2>
      <ul>
        <li>Name: ${bookingDetails.name}</li>
        <li>Email: ${bookingDetails.email}</li>
      </ul>
      <h2>Booking Details:</h2>
      <ul>
        <li>Room: ${bookingDetails.roomName}</li>
        <li>Check-in: ${new Date(bookingDetails.checkIn).toLocaleDateString()}</li>
        <li>Check-out: ${new Date(bookingDetails.checkOut).toLocaleDateString()}</li>
        <li>Guests: ${bookingDetails.guests}</li>
        <li>Total Amount: CAD $${bookingDetails.totalPrice}</li>
        <li>Payment ID: ${paymentIntent.id}</li>
      </ul>
    `
  };

  await Promise.all([
    transporter.sendMail(guestEmail),
    transporter.sendMail(hotelEmail)
  ]);
}

// Function to send cancellation emails
async function sendCancellationEmails(bookingDetails, refund) {
  // Email to guest
  const guestEmail = {
    from: process.env.EMAIL_USER,
    to: bookingDetails.email,
    subject: 'Booking Cancellation Confirmation - Hotel Viewmont',
    html: `
      <h1>Booking Cancellation Confirmation</h1>
      <p>Dear ${bookingDetails.name},</p>
      <p>Your booking has been successfully cancelled.</p>
      <h2>Refund Details:</h2>
      <ul>
        <li>Room: ${bookingDetails.roomName}</li>
        <li>Original Amount: CAD $${bookingDetails.totalPrice}</li>
        <li>Refund Amount: CAD $${(refund.amount / 100).toFixed(2)}</li>
        <li>Refund ID: ${refund.id}</li>
      </ul>
      <p>The refund has been processed and should appear in your account within 5-10 business days.</p>
      <p>We hope to welcome you to Hotel Viewmont in the future.</p>
    `
  };

  // Email to hotel
  const hotelEmail = {
    from: process.env.EMAIL_USER,
    to: process.env.HOTEL_EMAIL,
    subject: 'Booking Cancellation Notice',
    html: `
      <h1>Booking Cancellation Notice</h1>
      <h2>Cancelled Booking Details:</h2>
      <ul>
        <li>Guest Name: ${bookingDetails.name}</li>
        <li>Guest Email: ${bookingDetails.email}</li>
        <li>Room: ${bookingDetails.roomName}</li>
        <li>Original Check-in: ${new Date(bookingDetails.checkIn).toLocaleDateString()}</li>
        <li>Original Check-out: ${new Date(bookingDetails.checkOut).toLocaleDateString()}</li>
        <li>Refund Amount: CAD $${(refund.amount / 100).toFixed(2)}</li>
        <li>Refund ID: ${refund.id}</li>
      </ul>
    `
  };

  await Promise.all([
    transporter.sendMail(guestEmail),
    transporter.sendMail(hotelEmail)
  ]);
}

// Create payment intent endpoint
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'cad', bookingDetails } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        bookingId: bookingDetails?.id,
        checkIn: bookingDetails?.checkIn,
        checkOut: bookingDetails?.checkOut
      }
    });

    // Send confirmation emails if booking details are provided
    if (bookingDetails) {
      try {
        await sendConfirmationEmails(bookingDetails, paymentIntent);
      } catch (emailError) {
        console.error('Error sending confirmation emails:', emailError);
        // Don't fail the payment if email sending fails
      }
    }

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Error creating payment intent:', err);
    res.status(500).json({ error: err.message || 'Failed to create payment intent' });
  }
});

// Refund endpoint
app.post('/api/refund', async (req, res) => {
  try {
    const { paymentIntentId, bookingDetails } = req.body;

    // 1. Retrieve the payment intent to get the payment details
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // 2. Create a refund
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: 'requested_by_customer'
    });

    // 3. Send cancellation emails
    if (bookingDetails) {
      try {
        await sendCancellationEmails(bookingDetails, refund);
      } catch (emailError) {
        console.error('Error sending cancellation emails:', emailError);
        // Don't fail the refund if email sending fails
      }
    }

    res.json({ refund });
  } catch (err) {
    console.error('Error processing refund:', err);
    res.status(500).json({ error: err.message || 'Failed to process refund' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});