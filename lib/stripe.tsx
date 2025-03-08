// lib/stripe.ts
import Stripe from 'stripe';

// Initialize the Stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default stripe;
