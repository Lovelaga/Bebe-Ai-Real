# Admin Command Room

This branch adds the Admin Command Room endpoints and UI for the Master Command Center.

Environment variables (do NOT commit real values):

- FIREBASE_SERVICE_ACCOUNT (JSON string for Firebase Admin SDK)
- FIREBASE_API_KEY (Identity Toolkit API key - web client)
- FIREBASE_STORAGE_BUCKET (optional)
- ADMIN_EMAIL=beberaygardon32@gmail.com

APIs added:

- POST /api/admin/upload { filename, contentBase64 } - upload a file (admin only)
- POST /api/admin/trigger-upgrade { command } - schedule an upgrade (admin only)
- GET  /api/admin/logs - read recent admin logs (admin only)

These endpoints verify Firebase ID tokens and require the user to have role: 'admin' in Firestore users collection.

Notes:
- This is a scaffold to be extended. It stores logs in Firestore (if configured) or falls back to local files in /logs.
- File uploads use Firebase Storage if configured, otherwise save to /uploads.
