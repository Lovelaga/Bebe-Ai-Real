// pages/api/payments/checkout.js
const { getStripe } = require('../../../lib/stripeClient');
const admin = require('../../../lib/firebaseAdmin');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { uid, type, amount } = req.body || {};
  // type: 'credits' or 'subscription'

  if (!uid || !type) return res.status(400).json({ error: 'Missing uid or type' });

  try {
    const stripe = getStripe();

    if (type === 'credits') {
      // amount is cents or number of credits? We'll treat amount as cents price and metadata credits
      // Expect body: { uid, type: 'credits', credits: 10000, price_cents: 1999 }
      const credits = Number(req.body.credits || 0);
      const price_cents = Number(req.body.price_cents || 0);
      if (!credits || !price_cents) return res.status(400).json({ error: 'Missing credits or price' });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: { name: `Bebe AI Credits (${credits})` },
              unit_amount: price_cents,
            },
            quantity: 1,
          },
        ],
        metadata: { uid, type: 'credits', credits: String(credits) },
        success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/billing?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/billing?canceled=true`,
      });

      return res.status(200).json({ url: session.url, id: session.id });
    }

    if (type === 'subscription') {
      // subscription flow: expects price id in env or request
      const priceId = req.body.priceId || process.env.STRIPE_PRICE_MONTHLY;
      if (!priceId) return res.status(400).json({ error: 'Missing priceId' });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        subscription_data: { metadata: { uid } },
        metadata: { uid, type: 'subscription' },
        success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/billing?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/billing?canceled=true`,
      });

      return res.status(200).json({ url: session.url, id: session.id });
    }

    return res.status(400).json({ error: 'Unknown type' });
  } catch (err) {
    console.error('Checkout error', err);
    return res.status(500).json({ error: 'Checkout failed' });
  }
};
