const apiResponse = require('../utils/apiResponse');

/**
 * Middleware to protect routes — ensures the user has a valid Salesforce session
 */
const authGuard = (req, res, next) => {
  if (!req.session || !req.session.sfAccessToken || !req.session.sfInstanceUrl) {
    return apiResponse.error(
      res,
      'Not authenticated. Please connect your Salesforce account.',
      401
    );
  }
  next();
};

module.exports = authGuard;
