const AWS = require('aws-sdk'); // eslint-disable-line import/no-unresolved
const logger = require('./logger');

const ssm = new AWS.SSM({ region: 'us-east-1' });

let parameterCache = {};
let cacheExpiration = 0;
let distributionId = null;

async function loadParameters() {
  if (Date.now() <= cacheExpiration) {
    logger.debug('Using cached SSM Parameters');
    return true;
  }
  logger.debug('Loading SSM Parameters');
  try {
    if (!distributionId) {
      throw new Error('Distribution ID required to retrieve SSM Parameters');
    }
    const result = await ssm.getParametersByPath({
      Path: `/${distributionId}/`,
      Recursive: true,
      WithDecryption: true,
    }).promise();

    logger.debug('Parsing SSM Parameters');
    (result.Parameters || []).forEach((param) => {
      const cacheName = param.Name.replace(`/${distributionId}/`, '');
      logger.debug(`Caching "${param.Name}" as "${cacheName}": ${param.Value}`);
      parameterCache[cacheName] = param.Value;
    });
    cacheExpiration = Date.now() + 300000; // 5 minutes from now
    logger.debug(`SSM Parameter cache set to expire at ${cacheExpiration}`);
  } catch (error) {
    logger.error(error);
    return false;
  }

  return true;
}

function setDistributionId(id) {
  if (!id) {
    throw new Error('Distribution ID is required');
  }
  if (distributionId !== id) {
    logger.debug(`Setting SSM Parameter distributionId to ${id}`);
    cacheExpiration = 0;
    parameterCache = {};
    distributionId = id;
  }
}

async function getParameters() {
  const parametersLoaded = await loadParameters();
  if (parametersLoaded) {
    logger.debug('Returning SSM Parameters');
    return {
      clientId: parameterCache['oidc-client-id'],
      clientSecret: parameterCache['oidc-client-secret'],
      oauthScope: parameterCache['oidc-oauth-scope'] || 'openid',
      audience: parameterCache['expected-audience'] || null,
    };
  }

  throw new Error('Unable to load SSM Parameters');
}

async function getClientId() {
  const { clientId } = await getParameters();

  if (!clientId) throw new Error('Unable to load OAuth Client ID');

  return clientId;
}

async function getClientSecret() {
  const { clientSecret } = await getParameters();

  if (!clientSecret) throw new Error('Unable to load OAuth Client Secret');

  return clientSecret;
}

async function getOAuthScope() {
  const { oauthScope } = await getParameters();

  if (!oauthScope) throw new Error('Unable to load OAuth Scopes');

  return oauthScope;
}

async function getAudience() {
  const { audience } = await getParameters();

  return audience;
}

async function clearCache(clearDistributionId = false) {
  parameterCache = {};
  cacheExpiration = 0;
  if (clearDistributionId) {
    distributionId = null;
  }
}

module.exports = {
  clearCache,
  getAudience,
  getClientId,
  getClientSecret,
  getOAuthScope,
  setDistributionId,
};
