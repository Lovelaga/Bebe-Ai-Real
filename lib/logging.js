// lib/logging.js
const admin = require('./firebaseAdmin');
const fs = require('fs');
const path = require('path');

async function writeLog(userId, action, details = {}) {
  const timestamp = new Date().toISOString();
  // Prefer Firestore if available
  try {
    const db = admin.firestore();
    await db.collection('admin_logs').add({ userId, action, details, timestamp });
    return;
  } catch (err) {
    // Fallback to local file
    try {
      const logsDir = path.join(process.cwd(), 'logs');
      if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
      const file = path.join(logsDir, 'admin.log');
      const line = `${timestamp} | ${userId} | ${action} | ${JSON.stringify(details)}\n`;
      fs.appendFileSync(file, line);
    } catch (e) {
      console.error('Failed to write fallback log', e);
    }
  }
}

async function readLogs(limit = 100) {
  try {
    const db = admin.firestore();
    const snaps = await db.collection('admin_logs').orderBy('timestamp','desc').limit(limit).get();
    return snaps.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    // fallback read local file
    try {
      const file = require('path').join(process.cwd(), 'logs', 'admin.log');
      if (!fs.existsSync(file)) return [];
      const lines = fs.readFileSync(file, 'utf8').trim().split('\n').reverse();
      return lines.slice(0, limit).map((ln, i) => ({ id: `local-${i}`, raw: ln }));
    } catch (e) {
      console.error('Failed to read logs fallback', e);
      return [];
    }
  }
}

module.exports = { writeLog, readLogs };
