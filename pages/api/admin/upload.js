// pages/api/admin/upload.js
const admin = require('../../lib/firebaseAdmin');
const { saveFile } = require('../../lib/storage');
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

    const { filename, contentBase64 } = req.body || {};
    if (!filename || !contentBase64) return res.status(400).json({ error: 'Missing filename or contentBase64' });

    const result = await saveFile(filename, contentBase64);

    await writeLog(uid, 'upload', { filename, result });

    return res.status(200).json({ ok: true, result });
  } catch (err) {
    console.error('Upload error', err);
    return res.status(500).json({ error: 'Upload failed' });
  }
};
