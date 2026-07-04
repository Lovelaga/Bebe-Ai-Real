// pages/billing/index.js
import { useEffect, useState } from 'react';

export default function BillingPage() {
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = typeof window !== 'undefined' ? localStorage.getItem('bebe_id_token') : null;
      if (!token) { setLoading(false); return; }
      const res = await fetch('/api/credits/get', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) { setLoading(false); return; }
      const data = await res.json();
      setCredits(data.credits);
      setLoading(false);
    }
    load();
  }, []);

  async function buyCredits() {
    const token = localStorage.getItem('bebe_id_token');
    const res = await fetch('/api/payments/checkout', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: 'me', type: 'credits', credits: 100000, price_cents: 1999 })
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  async function subscribe() {
    const res = await fetch('/api/payments/checkout', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: 'me', type: 'subscription' })
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Billing</h1>
      {loading ? <p>Loading...</p> : <p>Your credits: {credits}</p>}

      <div style={{ marginTop: 20 }}>
        <h3>Buy credits</h3>
        <button onClick={buyCredits}>Buy 100,000 credits — $19.99</button>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Subscription</h3>
        <button onClick={subscribe}>Subscribe to Pro (monthly)</button>
      </div>

      <p style={{ marginTop: 20 }}>Note: This is a demo flow. Use Stripe test keys for local testing.</p>
    </div>
  );
}
