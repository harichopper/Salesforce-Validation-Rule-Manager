import client from './client';

/** Fetch all validation rules for a given Salesforce object */
export const fetchValidationRules = (objectName = 'Account') =>
  client.get('/api/validation-rules', { params: { object: objectName } });

/** Toggle a single rule on or off */
export const toggleRule = (ruleName, active, object = 'Account') =>
  client.post('/api/toggle-rule', { ruleName, active, object });

/** Toggle ALL rules for an object */
export const toggleAllRules = (active, object = 'Account') =>
  client.post('/api/toggle-all', { active, object });

/** Deploy (save) a single rule to Salesforce */
export const deployRule = (ruleName, active, object = 'Account') =>
  client.post('/api/deploy', { ruleName, active, object });

/** Fetch connected org information */
export const fetchOrgInfo = () =>
  client.get('/api/org-info');
