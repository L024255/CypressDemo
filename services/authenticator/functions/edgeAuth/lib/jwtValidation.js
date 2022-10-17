const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const logger = require('./logger');
const keystore = require('./keystore');
const { ExpiredTokenError } = require('./models/ExpiredTokenError');

const jwtVerify = promisify(jwt.verify);

async function validateToken(token, expectedAudience = null, expectedIssuer, expectedAlgorithms, jwksUrl) {
  try {
    logger.debug('Decoding JWT');
    const decodedJwt = jwt.decode(token, { complete: true });

    if (!decodedJwt.payload.iss || !decodedJwt.header.kid) {
      throw new Error('JWT lacks required attributes');
    }

    logger.debug('Retrieving certificate for token signature validation');
    const cert = await keystore.getCertificate(decodedJwt.header.kid, jwksUrl);

    if (!cert) {
      throw new Error(`signing certificate '${decodedJwt.header.kid}' unavailable for issuer ${decodedJwt.payload.iss}`);
    }

    let validatedJwtPayload;
    try {
      const audience = !expectedAudience ? null : expectedAudience.split(',');

      const temporaryJwt = await jwtVerify(token, cert, { issuer: expectedIssuer, algorithms: expectedAlgorithms });

      if (audience) {
        if (!temporaryJwt.aud && !!temporaryJwt.azp) {
          if (audience.includes(temporaryJwt.azp) === false) {
            throw new Error('JWT has no aud and azp is not one of the expected audiences');
          }
        } else {
          const jwtAudience = Array.isArray(temporaryJwt.aud) ? temporaryJwt.aud
            : [temporaryJwt.aud];

          const foundMatchingAudience = jwtAudience.some((jwtAud) => {
            return audience.includes(jwtAud);
          });

          if (!foundMatchingAudience) {
            throw new Error('JWT aud does not match any of the expected audiences');
          }
        }
      }

      validatedJwtPayload = temporaryJwt;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        // TODO: Refresh Token
        logger.error('token appears valid, but has expired');
        throw new ExpiredTokenError();
      } else if (error.name === 'JsonWebTokenError') {
        logger.error('Token error:', error.message);
      } else {
        logger.error(error);
      }
    }

    logger.debug(`Validation result: ${validatedJwtPayload ? 'valid' : 'invalid'}`);
    return validatedJwtPayload || false;
  } catch (error) {
    if (error instanceof ExpiredTokenError) {
      throw error;
    }
    logger.error(error);
  }

  return false;
}

module.exports = {
  validateToken,
  clearKeystore: keystore.clearKeystore,
};