jest.mock('../lib/parameterStore', () => {
  return {
    getClientId: jest.fn().mockResolvedValue('test-client-id'),
    getClientSecret: jest.fn().mockResolvedValue('test-client-secret'),
    getAudience: jest.fn().mockResolvedValue('test-audience'),
    getOAuthScope: jest.fn().mockResolvedValue('openid'),
    setDistributionId: jest.fn(),
  };
});

jest.mock('../lib/jwtValidation', () => {
  return {
    validateToken: jest.fn().mockResolvedValue({
      iss: 'https://login.microsoftonline.com/18a59a81-eea8-4c30-948a-d8824cdc2580/v2.0',
      aud: 'aud_test',
    }),
  };
});

const nock = require('nock');
const { lambdaHandler } = require('../index');
const parameterStore = require('../lib/parameterStore');
const jwtValidation = require('../lib/jwtValidation');
const { ExpiredTokenError } = require('../lib/models/ExpiredTokenError');
const {
  initialRequest,
  authCallbackRequest,
  validRequest,
  validExpiredRequest,
} = require('./events');

process.env.LOG_LEVEL = 'WARN';

nock('https://login.microsoftonline.com/18a59a81-eea8-4c30-948a-d8824cdc2580')
  .persist()
  .get('/v2.0/.well-known/openid-configuration')
  .reply(200, {
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
  })
  .get('/discovery/v2.0/keys')
  .reply(200, {
    keys: [{
      kty: 'RSA',
      e: 'AQAB',
      kid: 'de999801-9409-464b-a4c8-16c721f23828',
      n: '3ZWrUY0Y6IKN1qI4BhxR2C7oHVFgGPYkd38uGq1jQNSqEvJFcN93CYm16_G78FAFKWqwsJb3Wx-nbxDn6LtP4AhULB1H0K0g7_jLklDAHvI8yhOKlvoyvsUFPWtNxlJyh5JJXvkNKV_4Oo12e69f8QCuQ6NpEPl-cSvXIqUYBCs',
    }],
  });

describe('index', () => {
  afterEach(() => {
    parameterStore.getClientId.mockClear();
    parameterStore.getClientSecret.mockClear();
    parameterStore.getOAuthScope.mockClear();
    parameterStore.setDistributionId.mockClear();
  });

  describe('when unable to retrieve SSM Parameters', () => {
    beforeEach(() => {
      parameterStore.getClientId.mockRejectedValue(new Error('Testing Unable To Retrieve SSM Parameters'));
    });
    afterEach(() => {
      parameterStore.getClientId.mockResolvedValue('test-client-id');
    });

    it('returns 500 on errors', async () => {
      const result = await lambdaHandler(initialRequest, {});

      expect(result).toMatchObject({
        headers: {
          'content-type': [
            { key: 'Content-Type', value: 'text/html' },
          ],
        },
        status: 500,
        body: expect.stringContaining('Internal Server Error'),
      });
    });
  });

  describe('initial request', () => {
    it('returns an authorization redirect', async () => {
      const result = await lambdaHandler(initialRequest, {});

      expect(result).toMatchObject({
        headers: {
          location: [
            { key: 'Location', value: expect.stringMatching(/https:\/\/login\.microsoftonline\.com\/18a59a81-eea8-4c30-948a-d8824cdc2580\/oauth2\/v2\.0\/authorize\?redirect_uri=https%3A%2F%2Fd1l1caev0ejgt7\.cloudfront\.net%2F_callback&client_id=test-client-id&scope=openid&response_type=code&state=https%3A%2F%2Fd1l1caev0ejgt7\.cloudfront\.net%2F/) },
          ],
          'set-cookie': expect.arrayContaining([
            { key: 'Set-Cookie', value: expect.stringMatching(/accessToken=; Path=\/; Expires=/) },
            { key: 'Set-Cookie', value: expect.stringMatching(/refreshToken=; Path=\/; Expires=/) },
            { key: 'Set-Cookie', value: expect.stringMatching(/idToken=; Path=\/; Expires=/) },
            { key: 'Set-Cookie', value: expect.stringMatching(/^nonce=(.+);/) },
          ]),
        },
        status: 302,
      });
    });
  });

  describe('calling the authorization callback', () => {
    let federationServerMock;
    let requestBody;
    beforeEach(() => {
      federationServerMock = nock('https://login.microsoftonline.com/18a59a81-eea8-4c30-948a-d8824cdc2580')
        .post('/oauth2/v2.0/token', (body) => {
          requestBody = body;
          return true;
        })
        .reply(200, {
          access_token: 'test-access-token',
          refresh_token: 'test-refresh-token',
          id_token: 'test-id-token',
        });
    });

    it('returns a redirect with cookies', async () => {
      const result = await lambdaHandler(authCallbackRequest, {});

      expect(result).toMatchObject({
        headers: {
          location: [
            { key: 'Location', value: 'https://d1l1caev0ejgt7.cloudfront.net/' },
          ],
          'set-cookie': expect.arrayContaining([
            { key: 'Set-Cookie', value: 'accessToken=test-access-token; Max-Age=3600' },
            { key: 'Set-Cookie', value: 'refreshToken=test-refresh-token; Max-Age=3600' },
            { key: 'Set-Cookie', value: 'idToken=test-id-token; Max-Age=3600' },
            { key: 'Set-Cookie', value: expect.stringMatching(/nonce=; Path=\/; Expires=(.+)/) },
          ]),
        },
        status: 302,
      });

      expect(federationServerMock.isDone()).toBe(true);
      expect(requestBody).toMatchObject({
        client_id: 'test-client-id',
        client_secret: 'test-client-secret',
        code: 'abc123',
        grant_type: 'authorization_code',
        redirect_uri: 'https://d1l1caev0ejgt7.cloudfront.net/_callback',
        state: 'https://d1l1caev0ejgt7.cloudfront.net/',
      });
    });
  });

  describe('calling with an accessToken cookie', () => {
    afterEach(() => {
      jwtValidation.validateToken.mockClear();
      jwtValidation.validateToken.mockResolvedValue({
        iss: 'https://login.microsoftonline.com/18a59a81-eea8-4c30-948a-d8824cdc2580/v2.0',
        aud: 'aud_test',
      });
    });

    it('returns the original request when valid', async () => {
      const result = await lambdaHandler(validRequest, {});

      expect(result).toMatchObject(validRequest.Records[0].cf.request);
      expect(jwtValidation.validateToken).toHaveBeenCalledWith('test-access-token', 'test-audience', 'https://login.microsoftonline.com/18a59a81-eea8-4c30-948a-d8824cdc2580/v2.0', ['RS256'], 'https://login.microsoftonline.com/18a59a81-eea8-4c30-948a-d8824cdc2580/discovery/v2.0/keys');
    });

    it('returns a 401 if the access token is invalid', async () => {
      jwtValidation.validateToken.mockResolvedValue(false);

      const result = await lambdaHandler(validRequest, {});

      expect(jwtValidation.validateToken).toHaveBeenCalledWith('test-access-token', 'test-audience', 'https://login.microsoftonline.com/18a59a81-eea8-4c30-948a-d8824cdc2580/v2.0', ['RS256'], 'https://login.microsoftonline.com/18a59a81-eea8-4c30-948a-d8824cdc2580/discovery/v2.0/keys');
      expect(result).toMatchObject({
        status: 401,
        headers: {
          'content-type': [
            { key: 'Content-Type', value: 'text/html' },
          ],
        },
        body: expect.stringContaining('Forbidden'),
      });
    });

    describe('when the token has expired', () => {
      beforeEach(() => {
        jwtValidation.validateToken.mockRejectedValue(new ExpiredTokenError());
      });

      it('returns an authorization request', async () => {
        const result = await lambdaHandler(validExpiredRequest, {});

        expect(result).toMatchObject({
          headers: {
            location: [
              { key: 'Location', value: expect.stringMatching(/https:\/\/login\.microsoftonline\.com\/18a59a81-eea8-4c30-948a-d8824cdc2580\/oauth2\/v2\.0\/authorize\?redirect_uri=https%3A%2F%2Fd1l1caev0ejgt7\.cloudfront\.net%2F_callback&client_id=test-client-id&scope=openid&response_type=code&state=https%3A%2F%2Fd1l1caev0ejgt7\.cloudfront\.net%2F/) },
            ],
            'set-cookie': expect.arrayContaining([
              { key: 'Set-Cookie', value: expect.stringMatching(/accessToken=; Path=\/; Expires=/) },
              { key: 'Set-Cookie', value: expect.stringMatching(/refreshToken=; Path=\/; Expires=/) },
              { key: 'Set-Cookie', value: expect.stringMatching(/idToken=; Path=\/; Expires=/) },
              { key: 'Set-Cookie', value: expect.stringMatching(/^nonce=(.+);/) },
            ]),
          },
          status: 302,
        });
      });
    });
  });
});
