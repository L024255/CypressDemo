const qs = require('querystring');
const cookies = require('../cookies');
const parameterStore = require('../parameterStore');
const { OAuthError } = require('./OAuthError');

const {
  COOKIE_NAME_ACCESS_TOKEN,
} = cookies;

/**
 * @prop {String} host
 * @prop {String} uri
 * @prop {String} currentUrl
 * @prop {Object} cookieHeader
 * @prop {Object} queryParams
 * @prop {String} distributionId
 * @prop {Object} request
 */
class AuthRequest {
  constructor(cfRecord) {
    const { request, config: { distributionId } } = cfRecord;

    const queryParams = qs.parse(request.querystring);
    const cookieHeader = cookies.parse((request.headers.cookie || [{}])[0].value || '') || {};
    const httpHost = request.headers.host[0].value;
    const httpUri = request.uri;

    parameterStore.setDistributionId(distributionId);

    Object.assign(this, {
      host: httpHost,
      uri: httpUri,
      currentUrl: `https://${httpHost}${httpUri}`,
      cookieHeader,
      queryParams,
      distributionId,
      request,
    });
  }

  get accessToken() {
    return this.cookieHeader[COOKIE_NAME_ACCESS_TOKEN] || null;
  }

  get hasAccessTokenCookie() {
    return !!this.accessToken;
  }

  get isAuthorizationCallback() {
    return this.uri.startsWith('/_callback');
  }

  get authorizationCallbackError() {
    if (this.isAuthorizationCallback && this.queryParams.error) {
      throw new OAuthError(this.queryParams);
    }

    return false;
  }

  get returnUrl() {
    return this.queryParams.state || `https://${this.host}/`;
  }

  getAuthorizationCodeExchangeBody(clientId, clientSecret) {
    const authorizationBody = {
      client_id: clientId,
      client_secret: clientSecret,
      code: this.queryParams.code,
      grant_type: 'authorization_code',
      redirect_uri: `https://${this.host}/_callback`,
    };

    if (this.queryParams.state) {
      authorizationBody.state = this.queryParams.state;
    }
    return authorizationBody;
  }

  getAuthorizationRedirectUrl(clientId, authorizationEndpoint, scope) {
    return `${authorizationEndpoint}?${qs.stringify({
      redirect_uri: `https://${this.host}/_callback`,
      client_id: clientId,
      scope,
      response_type: 'code',
      state: this.currentUrl,
    })}`;
  }
}

module.exports = { AuthRequest };
