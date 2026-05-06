const jsforce = require('jsforce');
const config = require('../config');
const logger = require('../utils/logger');

/**
 * Salesforce Service — encapsulates all JSForce interactions
 */
class SalesforceService {
  /**
   * Create a JSForce connection from session tokens
   */
  static getConnection(accessToken, instanceUrl) {
    return new jsforce.Connection({
      instanceUrl,
      accessToken,
      version: '58.0',
    });
  }

  /**
   * Build the OAuth2 authorization URL
   */
  static getAuthorizationUrl() {
    const oauth2 = new jsforce.OAuth2({
      loginUrl: config.salesforce.loginUrl,
      clientId: config.salesforce.clientId,
      clientSecret: config.salesforce.clientSecret,
      redirectUri: config.salesforce.redirectUri,
    });
    return oauth2.getAuthorizationUrl({ scope: 'full refresh_token' });
  }

  /**
   * Exchange authorization code for access/refresh tokens
   */
  static async authenticate(authorizationCode) {
    const oauth2 = new jsforce.OAuth2({
      loginUrl: config.salesforce.loginUrl,
      clientId: config.salesforce.clientId,
      clientSecret: config.salesforce.clientSecret,
      redirectUri: config.salesforce.redirectUri,
    });

    const conn = new jsforce.Connection({ oauth2 });
    const userInfo = await conn.authorize(authorizationCode);

    logger.success('Salesforce authentication successful', {
      userId: userInfo.id,
      orgId: userInfo.organizationId,
    });

    return {
      accessToken: conn.accessToken,
      refreshToken: conn.refreshToken,
      instanceUrl: conn.instanceUrl,
      userId: userInfo.id,
      orgId: userInfo.organizationId,
    };
  }

  /**
   * Get current user identity information
   */
  static async getUserInfo(accessToken, instanceUrl) {
    const conn = this.getConnection(accessToken, instanceUrl);
    const identity = await conn.identity();
    return {
      userId: identity.user_id,
      orgId: identity.organization_id,
      username: identity.username,
      displayName: identity.display_name,
      email: identity.email,
      thumbnail: identity.photos?.thumbnail,
      orgName: identity.organization_id,
    };
  }

  /**
   * Fetch org information
   */
  static async getOrgInfo(accessToken, instanceUrl) {
    const conn = this.getConnection(accessToken, instanceUrl);
    const identity = await conn.identity();

    // Query organization details
    const orgResult = await conn.query(
      `SELECT Id, Name, OrganizationType, IsSandbox, InstanceName FROM Organization LIMIT 1`
    );
    const org = orgResult.records[0] || {};

    return {
      orgId: identity.organization_id,
      orgName: org.Name || 'Unknown',
      orgType: org.OrganizationType || 'Unknown',
      isSandbox: org.IsSandbox || false,
      instanceName: org.InstanceName || 'Unknown',
      instanceUrl,
      username: identity.username,
      displayName: identity.display_name,
      email: identity.email,
      thumbnail: identity.photos?.thumbnail,
    };
  }

  /**
   * Fetch all validation rules for the Account object via Tooling API
   */
  static async getValidationRules(accessToken, instanceUrl, objectName = 'Account') {
    const conn = this.getConnection(accessToken, instanceUrl);

    logger.info(`Fetching validation rules for object: ${objectName}`);

    const query = `
      SELECT Id, ValidationName, Active, Description, ErrorDisplayField,
             ErrorMessage, EntityDefinition.QualifiedApiName,
             NamespacePrefix, ManageableState
      FROM ValidationRule
      WHERE EntityDefinition.QualifiedApiName = '${objectName}'
      ORDER BY ValidationName ASC
    `;

    const result = await conn.tooling.query(query);

    logger.success(`Found ${result.records.length} validation rules for ${objectName}`);

    return result.records.map((rule) => ({
      id: rule.Id,
      name: rule.ValidationName,
      active: rule.Active,
      description: rule.Description || '',
      errorDisplayField: rule.ErrorDisplayField || '',
      errorMessage: rule.ErrorMessage || '',
      entityName: rule.EntityDefinition?.QualifiedApiName || objectName,
      namespacePrefix: rule.NamespacePrefix || '',
      manageableState: rule.ManageableState || '',
      fullName: rule.NamespacePrefix
        ? `${rule.NamespacePrefix}__${rule.ValidationName}`
        : rule.ValidationName,
    }));
  }

  /**
   * Read a single validation rule's full metadata via Metadata API
   */
  static async readRuleMetadata(conn, objectName, ruleName) {
    return new Promise((resolve, reject) => {
      conn.metadata.read('ValidationRule', [`${objectName}.${ruleName}`], (err, result) => {
        if (err) return reject(err);
        // result can be a single object or an array
        const meta = Array.isArray(result) ? result[0] : result;
        resolve(meta);
      });
    });
  }

  /**
   * Update (deploy) a validation rule's metadata — toggle active state
   */
  static async updateRuleMetadata(conn, metadata) {
    return new Promise((resolve, reject) => {
      conn.metadata.update('ValidationRule', metadata, (err, result) => {
        if (err) return reject(err);
        resolve(Array.isArray(result) ? result[0] : result);
      });
    });
  }

  /**
   * Toggle a single validation rule on/off
   */
  static async toggleRule(accessToken, instanceUrl, objectName, ruleName, active) {
    const conn = this.getConnection(accessToken, instanceUrl);
    const fullApiName = `${objectName}.${ruleName}`;

    logger.info(`Reading metadata for rule: ${fullApiName}`);
    const meta = await this.readRuleMetadata(conn, objectName, ruleName);

    if (!meta || !meta.fullName) {
      throw new Error(`Validation rule not found: ${fullApiName}`);
    }

    // Update the active flag
    meta.active = active;

    logger.info(`Deploying rule ${fullApiName} with active=${active}`);
    const result = await this.updateRuleMetadata(conn, meta);

    if (!result.success) {
      const errMsg = result.errors
        ? (Array.isArray(result.errors) ? result.errors.map((e) => e.message).join(', ') : result.errors.message)
        : 'Unknown deployment error';
      throw new Error(`Failed to deploy ${fullApiName}: ${errMsg}`);
    }

    logger.success(`Rule ${fullApiName} updated successfully — active: ${active}`);
    return { success: true, fullName: fullApiName, active };
  }

  /**
   * Toggle ALL validation rules for an object
   */
  static async toggleAllRules(accessToken, instanceUrl, objectName, active) {
    const rules = await this.getValidationRules(accessToken, instanceUrl, objectName);
    const conn = this.getConnection(accessToken, instanceUrl);

    const results = [];
    const errors = [];

    for (const rule of rules) {
      try {
        const meta = await this.readRuleMetadata(conn, objectName, rule.fullName);
        if (!meta || !meta.fullName) {
          errors.push({ rule: rule.fullName, error: 'Metadata not found' });
          continue;
        }

        meta.active = active;
        const result = await this.updateRuleMetadata(conn, meta);

        if (result.success) {
          results.push({ rule: rule.fullName, active, success: true });
        } else {
          const errMsg = result.errors
            ? (Array.isArray(result.errors) ? result.errors.map((e) => e.message).join(', ') : result.errors.message)
            : 'Unknown error';
          errors.push({ rule: rule.fullName, error: errMsg });
        }
      } catch (err) {
        errors.push({ rule: rule.fullName, error: err.message });
      }
    }

    logger.info(`Toggle all complete. Success: ${results.length}, Errors: ${errors.length}`);

    return {
      totalRules: rules.length,
      updated: results.length,
      failed: errors.length,
      results,
      errors,
      active,
    };
  }

  /**
   * Deploy (update) a specific validation rule's metadata — full deployment
   */
  static async deployRule(accessToken, instanceUrl, objectName, ruleName, active) {
    return this.toggleRule(accessToken, instanceUrl, objectName, ruleName, active);
  }
}

module.exports = SalesforceService;
