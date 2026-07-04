// lib/credits.js
const admin = require('./firebaseAdmin');

async function getCredits(uid) {
  const db = admin.firestore();
  const doc = await db.collection('users').doc(uid).get();
  if (!doc.exists) return null;
  const data = doc.data();
  return { credits: data.credits || 0, role: data.role || 'user' };
}

async function addCredits(uid, amount, reason = '') {
  const db = admin.firestore();
  const ref = db.collection('users').doc(uid);
  await db.runTransaction(async (tx) => {
    const doc = await tx.get(ref);
    if (!doc.exists) {
      tx.set(ref, { credits: amount });
    } else {
      const prev = doc.data().credits || 0;
      tx.update(ref, { credits: prev + Number(amount) });
    }
  });
  // record a transaction
  await db.collection('credit_transactions').add({ uid, amount: Number(amount), reason, createdAt: admin.firestore.FieldValue.serverTimestamp() });
}

async function subtractCredits(uid, amount, reason = '') {
  const db = admin.firestore();
  const ref = db.collection('users').doc(uid);
  await db.runTransaction(async (tx) => {
    const doc = await tx.get(ref);
    if (!doc.exists) throw new Error('User not found');
    const prev = doc.data().credits || 0;
    const next = prev - Number(amount);
    if (next < 0) throw new Error('Insufficient credits');
    tx.update(ref, { credits: next });
  });
  await db.collection('credit_transactions').add({ uid, amount: -Number(amount), reason, createdAt: admin.firestore.FieldValue.serverTimestamp() });
}

module.exports = { getCredits, addCredits, subtractCredits };
