const SalesforceService = require('../services/salesforceService');
const logger = require('../utils/logger');
const apiResponse = require('../utils/apiResponse');

/**
 * Rules Controller — handles validation rule CRUD operations
 */

// GET /api/validation-rules?object=Account
exports.getValidationRules = async (req, res, next) => {
  try {
    const objectName = req.query.object || 'Account';
    const { sfAccessToken, sfInstanceUrl } = req.session;

    const rules = await SalesforceService.getValidationRules(sfAccessToken, sfInstanceUrl, objectName);

    return apiResponse.success(res, {
      object: objectName,
      count: rules.length,
      rules,
    }, `Fetched ${rules.length} validation rules for ${objectName}`);
  } catch (err) {
    logger.error('Error fetching validation rules:', err.message);
    next(err);
  }
};

// POST /api/toggle-rule — toggle a single rule
exports.toggleRule = async (req, res, next) => {
  try {
    const { ruleName, active, object } = req.body;
    const objectName = object || 'Account';

    if (!ruleName || typeof active !== 'boolean') {
      return apiResponse.error(res, 'ruleName (string) and active (boolean) are required', 400);
    }

    const { sfAccessToken, sfInstanceUrl } = req.session;

    const result = await SalesforceService.toggleRule(
      sfAccessToken, sfInstanceUrl, objectName, ruleName, active
    );

    return apiResponse.success(res, result, `Rule "${ruleName}" ${active ? 'enabled' : 'disabled'} successfully`);
  } catch (err) {
    logger.error('Error toggling rule:', err.message);
    next(err);
  }
};

// POST /api/toggle-all — toggle all rules for an object
exports.toggleAllRules = async (req, res, next) => {
  try {
    const { active, object } = req.body;
    const objectName = object || 'Account';

    if (typeof active !== 'boolean') {
      return apiResponse.error(res, 'active (boolean) is required', 400);
    }

    const { sfAccessToken, sfInstanceUrl } = req.session;

    const result = await SalesforceService.toggleAllRules(
      sfAccessToken, sfInstanceUrl, objectName, active
    );

    return apiResponse.success(res, result, `All rules ${active ? 'enabled' : 'disabled'}`);
  } catch (err) {
    logger.error('Error toggling all rules:', err.message);
    next(err);
  }
};

// POST /api/deploy — deploy (save) a rule change back to Salesforce
exports.deployRule = async (req, res, next) => {
  try {
    const { ruleName, active, object } = req.body;
    const objectName = object || 'Account';

    if (!ruleName || typeof active !== 'boolean') {
      return apiResponse.error(res, 'ruleName (string) and active (boolean) are required', 400);
    }

    const { sfAccessToken, sfInstanceUrl } = req.session;

    const result = await SalesforceService.deployRule(
      sfAccessToken, sfInstanceUrl, objectName, ruleName, active
    );

    return apiResponse.success(res, result, `Rule "${ruleName}" deployed successfully`);
  } catch (err) {
    logger.error('Error deploying rule:', err.message);
    next(err);
  }
};

// GET /api/org-info — get Salesforce org information
exports.getOrgInfo = async (req, res, next) => {
  try {
    const { sfAccessToken, sfInstanceUrl } = req.session;

    const orgInfo = await SalesforceService.getOrgInfo(sfAccessToken, sfInstanceUrl);

    return apiResponse.success(res, orgInfo, 'Org info fetched successfully');
  } catch (err) {
    logger.error('Error fetching org info:', err.message);
    next(err);
  }
};
