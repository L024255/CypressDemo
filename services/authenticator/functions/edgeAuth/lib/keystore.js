const fetch = require('node-fetch');
const jwkToPem = require('jwk-to-pem');
const logger = require('./logger');

const cachedCertificates = new Map(); // kid => certificate

async function loadCertificates(jwksUri) {
  try {
    logger.debug(`retrieving JWKS from ${jwksUri}`);
    const response = await fetch(jwksUri);

    if (response.ok) {
      const { keys } = await response.json();
      keys.forEach((key) => {
        cachedCertificates.set(key.kid, jwkToPem(key));
      });
    } else {
      logger.warn(`${jwksUri} returned ${response.statusText}`);
    }

    return true;
  } catch (error) {
    logger.error('Error retrieving JWKS', jwksUri, error);
  }

  return false;
}

async function getCertificate(kid, jwksUri) {
  if (!kid) throw new Error('Key ID required to get certificate');

  if (!cachedCertificates.has(kid)) {
    logger.debug(`missing kid '${kid}' triggers JWKS reload`);
    await loadCertificates(jwksUri);
  }

  return cachedCertificates.get(kid);
}

async function clearKeystore() {
  cachedCertificates.clear();
}

module.exports = {
  getCertificate,
  clearKeystore,
};
