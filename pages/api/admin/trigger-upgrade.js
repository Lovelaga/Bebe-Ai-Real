// pages/api/admin/trigger-upgrade.js
const admin = require('../../lib/firebaseAdmin');
const { writeLog } = require('../../lib/logging');

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

    const { command } = req.body || {};

    // Record the requested upgrade action
    await db.collection('system_upgrades').add({ command, requestedBy: uid, createdAt: admin.firestore.FieldValue.serverTimestamp() });

    await writeLog(uid, 'trigger-upgrade', { command });

    // In a real system this would enqueue a job; here we respond with success
    return res.status(200).json({ ok: true, message: 'Upgrade scheduled' });
  } catch (err) {
    console.error('Trigger upgrade error', err);
    return res.status(500).json({ error: 'Failed to trigger upgrade' });
  }
};
