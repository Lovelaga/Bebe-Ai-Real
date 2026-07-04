// pages/api/auth/register.js
const admin = require('../../../lib/firebaseAdmin');
const config = require('../../../lib/config');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password, displayName } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  try {
    // Create Firebase Auth user
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: displayName || email.split('@')[0],
      emailVerified: false,
      disabled: false,
    });

    // Create Firestore user profile with initial credits
    const db = admin.firestore();
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      role: userRecord.email === config.adminEmail ? 'admin' : 'user',
      credits: config.freeUserCredits,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Create a custom token so the client can sign in
    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    return res.status(200).json({ uid: userRecord.uid, token: customToken });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: err.message || 'Registration failed' });
  }
};
