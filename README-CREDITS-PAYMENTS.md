# Credits & Payments

This feature branch adds basic credit tracking and Stripe checkout integration.

Environment variables needed (do NOT commit real values):

- STRIPE_SECRET_KEY
- STRIPE_PUBLISHABLE_KEY (for client-side usage)
- STRIPE_WEBHOOK_SECRET (for verifying webhooks)
- STRIPE_PRICE_MONTHLY (optional: Stripe price id for subscription)
- CLIENT_URL (e.g., https://yourdomain.com)

Endpoints added:

- POST /api/payments/checkout → create Stripe checkout session for credits or subscription
- POST /api/payments/webhook → Stripe webhook handler (disable body parser)
- GET  /api/credits/get → return a user's credits and role (requires Firebase idToken)
- POST /api/credits/adjust → admin-only endpoint to add/subtract credits

Notes on testing locally:

- Use Stripe test keys and the Stripe CLI to forward webhooks to your local endpoint.
- Ensure FIREBASE_SERVICE_ACCOUNT and FIREBASE_API_KEY are configured for auth and Firestore operations.
