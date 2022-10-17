const qs = require('querystring');
const fetch = require('node-fetch');
const logger = require('./logger');
const nonceHelper = require('./nonce');
const responseHelper = require('./responses');
const parameterStore = require('./parameterStore');
const cookies = require('./cookies');
const { OAuthError } = require('./models/OAuthError');
const { HttpError } = require('./models/HttpError');

const {
  COOKIE_NAME_ACCESS_TOKEN,
  COOKIE_NAME_ID_TOKEN,
  COOKIE_NAME_NONCE,
  COOKIE_NAME_REFRESH_TOKEN,
  COOKIE_OPTIONS_CLEAR,
  COOKIE_OPTIONS_SET,
} = cookies;

// OpenID Connect metadata document for Lilly's production Azure AD.  See https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-protocols-oidc
const OPENID_METADATA_URL = 'https://login.microsoftonline.com/18a59a81-eea8-4c30-948a-d8824cdc2580/v2.0/.well-known/openid-configuration';

let openidMetadataRefreshed = false;
// metadata is relatively static, so it's OK to put a default value in code
let openidMetadata = {
  token_endpoint: 'https://login.microsoftonline.com/18a59a81-eea8-4c30-948a-d8824cdc2580/oauth2/v2.0/token',
  token_endpoint_auth_methods_supported: ['client_secret_post', 'private_key_jwt', 'client_secret_basic'],
  jwks_uri: 'https://login.microsoftonline.com/18a59a81-eea8-4c30-948a-d8824cdc2580/discovery/v2.0/keys',
  response_modes_supported: ['query', 'fragment', 'form_post'],
  subject_types_supported: ['pairwise'],
  id_token_signing_alg_values_supported: ['RS256'],
  response_types_supported: ['code', 'id_token', 'code id_token', 'id_token token'],
  scopes_supported: ['openid', 'profile', 'email', 'offline_access'],
  issuer: 'https://login.microsoftonline.com/18a59a81-eea8-4c30-948a-d8824cdc2580/v2.0',
  request_uri_parameter_supported: false,
  userinfo_endpoint: 'https://graph.microsoft.com/oidc/userinfo',
  authorization_endpoint: 'https://login.microsoftonline.com/18a59a81-eea8-4c30-948a-d8824cdc2580/oauth2/v2.0/authorize',
  http_logout_supported: true,
  frontchannel_logout_supported: true,
  end_session_endpoint: 'https://login.microsoftonline.com/18a59a81-eea8-4c30-948a-d8824cdc2580/oauth2/v2.0/logout',
  claims_supported: ['sub', 'iss', 'cloud_instance_name', 'cloud_instance_host_name', 'cloud_graph_host_name', 'msgraph_host', 'aud', 'exp', 'iat', 'auth_time', 'acr', 'nonce', 'preferred_username', 'name', 'tid', 'ver', 'at_hash', 'c_hash', 'email'],
  tenant_region_scope: 'NA',
  cloud_instance_name: 'microsoftonline.com',
  cloud_graph_host_name: 'graph.windows.net',
  msgraph_host: 'graph.microsoft.com',
  rbac_url: 'https://pas.windows.net',
};

function getOpenidJwksUri() {
  return openidMetadata.jwks_uri;
}

function getOpenidTokenSigningAlgorithms() {
  return openidMetadata.id_token_signing_alg_values_supported;
}

function getOpenidTokenEndpoint() {
  return openidMetadata.token_endpoint;
}

function getOpenidAuthorizationEndpoint() {
  return openidMetadata.authorization_endpoint;
}

function getOpenidIssuer() {
  return openidMetadata.issuer;
}

function transformError(error) {
  let errorMessage = `An error occurred: &quot;${error.message}&quot;`;
  if (error instanceof OAuthError) {
    errorMessage = `An OAuth error was returned by the federation server: &quot;${error.message}&quot;.`;
  } if (error instanceof HttpError) {
    errorMessage = `An HTTP error was returned by the federation server: &quot;${error.message}&quot;.`;
  }

  return responseHelper.errorResponse500(`${errorMessage}<!-- ${JSON.stringify({ ...error, message: error.message })} -->`);
}

async function refreshOpenidMetadata() {
  try {
    const response = await fetch(OPENID_METADATA_URL);
    if (response.ok) {
      openidMetadata = await response.json();
      openidMetadataRefreshed = true;
    }
  } catch (error) {
    logger.warn(error);
  }
}

// eslint-disable-next-line consistent-return
async function exchangeAuthorizationCodeForTokens(authRequest) {
  try {
    if (!openidMetadataRefreshed) {
      await refreshOpenidMetadata();
    }
    const [clientId, clientSecret] = await Promise.all([
      parameterStore.getClientId(),
      parameterStore.getClientSecret(),
    ]);

    if (!authRequest.authorizationCallbackError) {
      const authorizationBody = authRequest.getAuthorizationCodeExchangeBody(clientId, clientSecret);

      const response = await fetch(getOpenidTokenEndpoint(), {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: qs.stringify(authorizationBody),
      });

      if (!response.ok) {
        throw new HttpError('Could not exchange authorization code for tokens',
          response.status, response.statusText, await response.text());
      }

      return await response.json();
    }
  } catch (error) {
    logger.error(error);

    throw error;
  }
}

async function getAuthorizationCodeReceivedResponse(authRequest) {
  try {
    if (!openidMetadataRefreshed) {
      await refreshOpenidMetadata();
    }

    const tokenExchangeResponse = await exchangeAuthorizationCodeForTokens(authRequest);

    const response = responseHelper.redirectResponse302(authRequest.returnUrl, {
      'set-cookie': [
        cookies.buildCookieHeader(COOKIE_NAME_ACCESS_TOKEN,
          tokenExchangeResponse.access_token, COOKIE_OPTIONS_SET),
        cookies.buildCookieHeader(COOKIE_NAME_REFRESH_TOKEN,
          tokenExchangeResponse.refresh_token, COOKIE_OPTIONS_SET),
        cookies.buildCookieHeader(COOKIE_NAME_ID_TOKEN,
          tokenExchangeResponse.id_token, COOKIE_OPTIONS_SET),
        cookies.buildCookieHeader(COOKIE_NAME_NONCE,
          '', COOKIE_OPTIONS_CLEAR),
      ],
    });

    return response;
  } catch (error) {
    return transformError(error);
  }
}

async function getAuthorizationRedirectResponse(authRequest) {
  try {
    if (!openidMetadataRefreshed) {
      await refreshOpenidMetadata();
    }

    const clientId = await parameterStore.getClientId();
    const scope = await parameterStore.getOAuthScope();
    const nonceValue = nonceHelper.getNonce();

    const redirectUrl = await authRequest.getAuthorizationRedirectUrl(clientId,
      getOpenidAuthorizationEndpoint(), scope);

    return responseHelper.redirectResponse302(redirectUrl, {
      'set-cookie': [
        cookies.buildCookieHeader(COOKIE_NAME_ACCESS_TOKEN, '', COOKIE_OPTIONS_CLEAR),
        cookies.buildCookieHeader(COOKIE_NAME_REFRESH_TOKEN, '', COOKIE_OPTIONS_CLEAR),
        cookies.buildCookieHeader(COOKIE_NAME_ID_TOKEN, '', COOKIE_OPTIONS_CLEAR),
        cookies.buildCookieHeader(COOKIE_NAME_NONCE, nonceValue, COOKIE_OPTIONS_SET),
      ],
    });
  } catch (error) {
    return transformError(error);
  }
}

module.exports = {
  getAuthorizationRedirectResponse,
  getAuthorizationCodeReceivedResponse,
  getOpenidJwksUri,
  getOpenidIssuer,
  getOpenidTokenSigningAlgorithms,
};
