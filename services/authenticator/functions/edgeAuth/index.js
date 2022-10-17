const logger = require('./lib/logger');
const { AuthRequest } = require('./lib/models/AuthRequest');
const { ExpiredTokenError } = require('./lib/models/ExpiredTokenError');
const oauthHelper = require('./lib/oauth');
const responseHelper = require('./lib/responses');
const parameterStore = require('./lib/parameterStore');
const jwtValidation = require('./lib/jwtValidation');

process.env.LOG_LEVEL = 'DEBUG';

const lambdaHandler = async (event) => {
  let authRequest;
  try {
    authRequest = new AuthRequest(event.Records[0].cf);
    const expectedAudience = await parameterStore.getAudience();

    if (authRequest.hasAccessTokenCookie) {
      const result = await jwtValidation.validateToken(
        authRequest.accessToken,
        expectedAudience,
        oauthHelper.getOpenidIssuer(),
        oauthHelper.getOpenidTokenSigningAlgorithms(),
        oauthHelper.getOpenidJwksUri(),
      );

      logger.debug(`JWT validation result: ${JSON.stringify(result)}`);
      if (result === false) {
        // A 403 is what one might expect, but because of needing to keep the S3 bucket secure we
        //  can't have it set to publicly visible for use with an S3 website. Thus we get 403s
        //  instead of 404s when an object isn't there. So, we use a 401 here instead of a 403
        //  so that we can set things up for SPAs
        return responseHelper.errorResponse401();
      }
      return authRequest.request;
    }

    if (authRequest.isAuthorizationCallback) {
      return oauthHelper.getAuthorizationCodeReceivedResponse(authRequest);
    }

    return oauthHelper.getAuthorizationRedirectResponse(authRequest);
  } catch (error) {
    if (error instanceof ExpiredTokenError) {
      return oauthHelper.getAuthorizationRedirectResponse(authRequest);
    }
    return responseHelper.errorResponse500(`<!-- ${JSON.stringify({ ...error, message: error.message })} -->`);
  }
};

module.exports = {
  lambdaHandler,
};
