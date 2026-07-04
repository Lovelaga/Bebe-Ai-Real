// pages/api/auth/me.js
// Verifies Firebase ID token and returns user profile including credits and role

const admin = require('../../../lib/firebaseAdmin');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/Bearer (.*)/);
  const idToken = match ? match[1] : null;

  if (!idToken) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;

    const db = admin.firestore();
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userDoc.data();

    return res.status(200).json({ user });
  } catch (err) {
    console.error('Me error', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
};
