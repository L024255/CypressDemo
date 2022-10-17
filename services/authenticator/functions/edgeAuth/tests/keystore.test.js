const nock = require('nock');
const keystore = require('../lib/keystore');

const JWKS_HOST = 'https://login.microsoftonline.com';
const JWKS_PATH = '/18a59a81-eea8-4c30-948a-d8824cdc2580/discovery/v2.0/keys';
const CERT = '-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDdlatRjRjogo3WojgGHFHYLugd\nUWAY9iR3fy4arWNA1KoS8kVw33cJibXr8bvwUAUparCwlvdbH6dvEOfou0/gCFQs\nHUfQrSDv+MuSUMAe8jzKE4qW+jK+xQU9a03GUnKHkkle+Q0pX/g6jXZ7r1/xAK5D\no2kQ+X5xK9cipRgEKwIDAQAB\n-----END PUBLIC KEY-----\n';
const JWKS = {
  keys: [{
    kty: 'RSA',
    e: 'AQAB',
    kid: 'de999801-9409-464b-a4c8-16c721f23828',
    n: '3ZWrUY0Y6IKN1qI4BhxR2C7oHVFgGPYkd38uGq1jQNSqEvJFcN93CYm16_G78FAFKWqwsJb3Wx-nbxDn6LtP4AhULB1H0K0g7_jLklDAHvI8yhOKlvoyvsUFPWtNxlJyh5JJXvkNKV_4Oo12e69f8QCuQ6NpEPl-cSvXIqUYBCs',
  }],
};


describe('lib/keystore', () => {
  beforeAll(() => {
    process.env.LOG_LEVEL = 'WARN';
    nock.disableNetConnect();
  });

  afterAll(() => {
    nock.restore();
    nock.enableNetConnect();
  });

  afterEach(() => {
    keystore.clearKeystore();
    nock.cleanAll();
  });

  describe('getCertificate', () => {
    it('retrieves and returns the certificate', async () => {
      nock(JWKS_HOST)
        .get(JWKS_PATH)
        .once()
        .reply(200, JWKS);

      const result = await keystore.getCertificate('de999801-9409-464b-a4c8-16c721f23828', `${JWKS_HOST}${JWKS_PATH}`);
      expect(result).toBe(CERT);

      expect(nock.isDone()).toBe(true);
    });

    it('uses a cached certificate if available', async () => {
      nock(JWKS_HOST)
        .get(JWKS_PATH)
        .twice()
        .reply(200, JWKS);

      let result = await keystore.getCertificate('de999801-9409-464b-a4c8-16c721f23828', `${JWKS_HOST}${JWKS_PATH}`);
      expect(result).toBe(CERT);
      result = await keystore.getCertificate('de999801-9409-464b-a4c8-16c721f23828', `${JWKS_HOST}${JWKS_PATH}`);
      expect(result).toBe(CERT);

      expect(nock.isDone()).toBe(false);
    });
  });
});
