// lib/stripeClient.js
// Lightweight Stripe client initializer
const Stripe = require('stripe');

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY not configured');
  return new Stripe(key, { apiVersion: '2024-11-15' });
}

module.exports = { getStripe };
