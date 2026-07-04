// pages/api/credits/get.js
const admin = require('../../../lib/firebaseAdmin');
const { getCredits } = require('../../../lib/credits');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/Bearer (.*)/);
  const idToken = match ? match[1] : null;
  if (!idToken) return res.status(401).json({ error: 'No token' });

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;
    const data = await getCredits(uid);
    return res.status(200).json({ uid, ...data });
  } catch (err) {
    console.error('Get credits error', err);
    return res.status(500).json({ error: 'Failed to get credits' });
  }
};
