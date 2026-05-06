const logger = require('../utils/logger');
const apiResponse = require('../utils/apiResponse');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  logger.error(`${err.message}`, {
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  // Salesforce-specific errors
  if (err.name === 'INVALID_SESSION_ID' || err.errorCode === 'INVALID_SESSION_ID') {
    return apiResponse.error(res, 'Salesforce session expired. Please re-authenticate.', 401);
  }

  if (err.name === 'sf:INVALID_OPERATION_WITH_EXPIRED_PASSWORD') {
    return apiResponse.error(res, 'Salesforce password has expired.', 401);
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  return apiResponse.error(res, message, statusCode);
};

module.exports = errorHandler;
