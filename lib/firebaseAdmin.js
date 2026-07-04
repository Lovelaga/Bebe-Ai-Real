const admin = require('firebase-admin');

// Initialize Firebase Admin SDK using service account JSON stored in env
// Set FIREBASE_SERVICE_ACCOUNT in your environment to the JSON string of the service account

if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : null;

  if (!serviceAccount) {
    // If no service account provided, initialize with default credentials (e.g., on GCP)
    admin.initializeApp();
  } else {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
}

module.exports = admin;
