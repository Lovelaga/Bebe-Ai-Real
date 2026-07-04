// lib/config.js
const defaultConfig = {
  adminEmail: process.env.ADMIN_EMAIL || 'beberaygardon32@gmail.com',
  freeUserCredits: Number(process.env.FREE_USER_CREDITS || 50000),
};

module.exports = defaultConfig;
