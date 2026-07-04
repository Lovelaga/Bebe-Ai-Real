// Simple config loader used by backend and server-side code
// Reads admin email and default credit settings from env

const defaultConfig = {
  adminEmail: "beberaygardon32@gmail.com",
  freeUserCredits: 50000,
};

module.exports = {
  adminEmail: process.env.ADMIN_EMAIL || defaultConfig.adminEmail,
  freeUserCredits: Number(process.env.FREE_USER_CREDITS || defaultConfig.freeUserCredits),
};
