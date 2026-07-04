// lib/storage.js
const admin = require('./firebaseAdmin');
const fs = require('fs');
const path = require('path');

async function saveFile(filename, contentBase64) {
  const buffer = Buffer.from(contentBase64, 'base64');

  // Try Firebase Storage if configured
  try {
    const bucket = admin.storage().bucket();
    if (bucket) {
      const file = bucket.file(filename);
      await file.save(buffer, { resumable: false, contentType: 'application/octet-stream' });
      // Make public link optional; here we return a gs:// path
      return { storage: 'firebase', path: `gs://${bucket.name}/${filename}` };
    }
  } catch (err) {
    // ignore and fallback to local
  }

  // Fallback: save to tmp or uploads directory
  const uploads = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploads)) fs.mkdirSync(uploads, { recursive: true });
  const filePath = path.join(uploads, filename);
  fs.writeFileSync(filePath, buffer);
  return { storage: 'local', path: filePath };
}

module.exports = { saveFile };
