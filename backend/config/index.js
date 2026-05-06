require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3001,
  sessionSecret: process.env.SESSION_SECRET || 'fallback-secret-change-me',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development',
  salesforce: {
    clientId: process.env.SF_CLIENT_ID?.trim(),
    clientSecret: process.env.SF_CLIENT_SECRET?.trim(),
    redirectUri: (process.env.SF_REDIRECT_URI || 'http://localhost:3001/auth/callback').trim(),
    loginUrl: (process.env.SF_LOGIN_URL || 'https://login.salesforce.com').trim(),
  },
};
