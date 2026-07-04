// pages/api/admin/logs.js
const admin = require('../../lib/firebaseAdmin');
const { readLogs } = require('../../lib/logging');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

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

    const logs = await readLogs(200);
    return res.status(200).json({ logs });
  } catch (err) {
    console.error('Logs error', err);
    return res.status(500).json({ error: 'Failed to read logs' });
  }
};
