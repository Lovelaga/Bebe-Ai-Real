// pages/api/credits/adjust.js
const admin = require('../../../lib/firebaseAdmin');
const { addCredits, subtractCredits } = require('../../../lib/credits');
const config = require('../../../lib/config');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/Bearer (.*)/);
  const idToken = match ? match[1] : null;
  if (!idToken) return res.status(401).json({ error: 'No token' });

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;
    const db = admin.firestore();
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) return res.status(403).json({ error: 'User profile missing' });
    const user = userDoc.data();
    if (user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });

    const { targetUid, action, amount } = req.body || {};
    if (!targetUid || !action || !amount) return res.status(400).json({ error: 'Missing targetUid, action, or amount' });

    if (action === 'add') {
      await addCredits(targetUid, Number(amount), `admin:${uid}`);
      return res.status(200).json({ ok: true });
    }
    if (action === 'subtract') {
      await subtractCredits(targetUid, Number(amount), `admin:${uid}`);
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: 'Unknown action' });
  } catch (err) {
    console.error('Adjust credits error', err);
    return res.status(500).json({ error: 'Failed to adjust credits' });
  }
};
