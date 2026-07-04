// pages/api/payments/webhook.js
const { getStripe } = require('../../../lib/stripeClient');
const admin = require('../../../lib/firebaseAdmin');
const { addCredits } = require('../../../lib/credits');

// Disable body parsing for raw webhook signature verification in Next.js
export const config = {
  api: { bodyParser: false },
};

const buffer = async (req) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', (err) => reject(err));
  });
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed');

  const stripe = getStripe();
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET');
    return res.status(500).end('Webhook secret not configured');
  }

  try {
    const buf = await buffer(req);
    const event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const metadata = session.metadata || {};
        // If credits purchase
        if (metadata.type === 'credits' && metadata.uid && metadata.credits) {
          const uid = metadata.uid;
          const credits = Number(metadata.credits || 0);
          await addCredits(uid, credits, 'stripe_checkout');
          console.log(`Added ${credits} credits to ${uid} via Stripe`);
        }
        // For subscription, you can mark user as pro in Firestore
        if (metadata.type === 'subscription' && metadata.uid) {
          const uid = metadata.uid;
          const db = admin.firestore();
          await db.collection('users').doc(uid).update({ isPro: true });
          console.log(`Marked ${uid} as Pro via subscription`);
        }
        break;
      }
      case 'invoice.payment_succeeded': {
        // handle recurring payments if needed
        break;
      }
      default:
        // console.log(`Unhandled event type ${event.type}`);
        break;
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error', err.message);
    res.status(400).send(`Webhook error: ${err.message}`);
  }
};
