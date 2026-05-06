const SalesforceService = require('../services/salesforceService');
const config = require('../config');
const logger = require('../utils/logger');
const apiResponse = require('../utils/apiResponse');

/**
 * Auth Controller — handles Salesforce OAuth 2.0 flow
 */

// GET /auth/salesforce — redirect user to Salesforce login
exports.login = (req, res, next) => {
  try {
    const authUrl = SalesforceService.getAuthorizationUrl();
    logger.info(`Redirecting to Salesforce: ${authUrl}`);
    res.redirect(authUrl);
  } catch (err) {
    next(err);
  }
};

// GET /auth/callback — handle Salesforce OAuth callback
exports.callback = async (req, res, next) => {
  try {
    const { code } = req.query;
    if (!code) {
      logger.error('No authorization code received from Salesforce');
      return res.redirect(`${config.frontendUrl}/login?error=no_code`);
    }

    const authResult = await SalesforceService.authenticate(code);

    // Store tokens in session
    req.session.sfAccessToken = authResult.accessToken;
    req.session.sfRefreshToken = authResult.refreshToken;
    req.session.sfInstanceUrl = authResult.instanceUrl;
    req.session.sfUserId = authResult.userId;
    req.session.sfOrgId = authResult.orgId;

    logger.success('OAuth callback successful, session created');

    // Redirect to frontend dashboard — use relative path for Vercel compatibility
    // If FRONTEND_URL is set, use it; otherwise fallback to relative
    const redirectUrl = config.nodeEnv === 'production' ? '/dashboard' : `${config.frontendUrl}/dashboard`;
    res.redirect(redirectUrl);
  } catch (err) {
    logger.error('OAuth callback failed:', err.message);
    res.redirect(`${config.frontendUrl}/login?error=auth_failed`);
  }
};

// GET /auth/status — check if user is authenticated
exports.status = (req, res) => {
  const isAuthenticated = !!(req.session && req.session.sfAccessToken && req.session.sfInstanceUrl);
  return apiResponse.success(res, {
    authenticated: isAuthenticated,
    instanceUrl: isAuthenticated ? req.session.sfInstanceUrl : null,
  });
};

// POST /auth/logout — destroy session and log out
exports.logout = (req, res) => {
  req.session = null; // cookie-session way to destroy session
  res.clearCookie('sf_val_mgr_session');
  logger.info('User logged out successfully');
  return apiResponse.success(res, null, 'Logged out successfully');
};
