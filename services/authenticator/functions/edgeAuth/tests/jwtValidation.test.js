const nock = require('nock');
const { ExpiredTokenError } = require('../lib/models/ExpiredTokenError');
const { validateToken } = require('../lib/jwtValidation');

const ISSUER = 'https://login.microsoftonline.com/18a59a81-eea8-4c30-948a-d8824cdc2580/v2.0';
const ALG = ['RS512'];
const JWKS_URL = 'https://login.microsoftonline.com/18a59a81-eea8-4c30-948a-d8824cdc2580/discovery/v2.0/keys';

nock('https://login.microsoftonline.com/18a59a81-eea8-4c30-948a-d8824cdc2580')
  .persist()
  .get('/discovery/v2.0/keys')
  .reply(200, {
    keys: [{
      kty: 'RSA',
      e: 'AQAB',
      kid: 'unit_test',
      n: '3ZWrUY0Y6IKN1qI4BhxR2C7oHVFgGPYkd38uGq1jQNSqEvJFcN93CYm16_G78FAFKWqwsJb3Wx-nbxDn6LtP4AhULB1H0K0g7_jLklDAHvI8yhOKlvoyvsUFPWtNxlJyh5JJXvkNKV_4Oo12e69f8QCuQ6NpEPl-cSvXIqUYBCs',
    }],
  });

process.env.LOG_LEVEL = 'NONE';

describe('lib/jwtValidation', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });

  afterAll(() => {
    nock.restore();
    nock.enableNetConnect();
  });

  describe('when given a valid token', () => {
    describe('aud attribute matches the expected audience', () => {
      it('returns the JWT payload', async () => {
        const result = await validateToken(
          'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6InVuaXRfdGVzdCJ9.eyJhdWQiOiJhdWRfdW5pdF90ZXN0IiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5taWNyb3NvZnRvbmxpbmUuY29tLzE4YTU5YTgxLWVlYTgtNGMzMC05NDhhLWQ4ODI0Y2RjMjU4MC92Mi4wIn0.zOgoo9zUjqN8zm_UpCkscCU-VdzhzszBASXokyJj0AwRc47qGnD9tbL60UyEEQLmfUNZBxGS5uDvTsqbkF9H-QU981XxzR3uiD554kSAeXK1eIfRgA29J_CjLS1mw4SrM3IHC2dt5ojO3NoJrJ_93GQPvv2qLwcgOhAY_0g8xmc',
          'aud_unit_test',
          ISSUER,
          ALG,
          JWKS_URL,
        );

        expect(result).toMatchObject({ aud: 'aud_unit_test', iss: ISSUER });
      });

      describe('aud attribute matches, when the expected audience is a csv', () => {
        it('returns the JWT payload', async () => {
          const result = await validateToken(
            'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6InVuaXRfdGVzdCJ9.eyJhdWQiOiJhdWRfdW5pdF90ZXN0IiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5taWNyb3NvZnRvbmxpbmUuY29tLzE4YTU5YTgxLWVlYTgtNGMzMC05NDhhLWQ4ODI0Y2RjMjU4MC92Mi4wIn0.zOgoo9zUjqN8zm_UpCkscCU-VdzhzszBASXokyJj0AwRc47qGnD9tbL60UyEEQLmfUNZBxGS5uDvTsqbkF9H-QU981XxzR3uiD554kSAeXK1eIfRgA29J_CjLS1mw4SrM3IHC2dt5ojO3NoJrJ_93GQPvv2qLwcgOhAY_0g8xmc',
            'aud_example,aud_unit_test',
            ISSUER,
            ALG,
            JWKS_URL,
          );

          expect(result).toMatchObject({ aud: 'aud_unit_test', iss: ISSUER });
        });
      });
    });

    describe('aud attribute doesnt match the expected audience', () => {
      it('returns false', async () => {
        const result = await validateToken(
          'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6InVuaXRfdGVzdCJ9.eyJhdWQiOiJhdWRfdW5pdF90ZXN0IiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5taWNyb3NvZnRvbmxpbmUuY29tLzE4YTU5YTgxLWVlYTgtNGMzMC05NDhhLWQ4ODI0Y2RjMjU4MC92Mi4wIn0.zOgoo9zUjqN8zm_UpCkscCU-VdzhzszBASXokyJj0AwRc47qGnD9tbL60UyEEQLmfUNZBxGS5uDvTsqbkF9H-QU981XxzR3uiD554kSAeXK1eIfRgA29J_CjLS1mw4SrM3IHC2dt5ojO3NoJrJ_93GQPvv2qLwcgOhAY_0g8xmc',
          'aud_example',
          ISSUER,
          ALG,
          JWKS_URL,
        );

        expect(result).toBe(false);
      });
    });

    describe('with no aud or azp attribute, when an audience is expected', () => {
      it('returns false', async () => {
        const result = await validateToken(
          'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6InVuaXRfdGVzdCJ9.eyJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vMThhNTlhODEtZWVhOC00YzMwLTk0OGEtZDg4MjRjZGMyNTgwL3YyLjAifQ.xsUhJFkFy7BA7t6uHU9lvrQDquOc8E-VEcF3aOz_5jcMS8hyUZl9d-6hSv6gQivVMuGuJEu6bOJ41rYzSnR6tFaB1bYDPubzDY3Ru1njHBBHOwTriAyoc6Do99bcGW0ZkNrI1B5I5-m-S1IV4NVh7O-Q1fFcPD9_x_PEVjHpduk',
          'aud_unit_test',
          ISSUER,
          ALG,
          JWKS_URL,
        );

        expect(result).toBe(false);
      });
    });

    describe('with an azp attribute, when an audience is expected ', () => {
      it('returns the JWT payload', async () => {
        const result = await validateToken(
          'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6InVuaXRfdGVzdCJ9.eyJhenAiOiJhcHBpZF91bml0X3Rlc3QiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vMThhNTlhODEtZWVhOC00YzMwLTk0OGEtZDg4MjRjZGMyNTgwL3YyLjAifQ.eR0sA7q5M7nUbxoh-jjrU-zVcy4cipAIApTJyawlAr_IQTB6Km3P9EuiWiFfJ3w5yFkSFpUiAC9Q3Mzwg3Dc6XupMVLnY_alFtlCAY8vp7vG00OJM23jow5TacLuY3PCCBXkegEj931Xuu9QB8upHF6iRzIz2df_LLOOJoNpH80',
          'appid_unit_test',
          ISSUER,
          ALG,
          JWKS_URL,
        );

        expect(result).toMatchObject({ azp: 'appid_unit_test', iss: ISSUER });
      });
    });

    describe('with an invalid iss attribute', () => {
      it('returns false', async () => {
        const result = await validateToken(
          'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6InVuaXRfdGVzdCJ9.eyJhdWQiOiJhdWRfdW5pdF90ZXN0IiwiaXNzIjoiaHR0cHM6Ly9zb21lYm9keWVsc2UuY29tIn0.1KFvplF1VjGPZU55Npi7SVlq8Mxx7cUlTTsB1UW4Qm95JBVTG4Svu484p--_zEOz-Wgc5swld5EYuX_FAyIPJWMAaOLe1IP7IaK4QfuURseRxjNd53rmEPTjSRMar-yXtCvzliDP3PhrUhpPRIcB4KEmbprhnK7B0pKuLNLAgk4',
          null,
          ISSUER,
          ALG,
          JWKS_URL,
        );

        expect(result).toBe(false);
      });
    });

    describe('with no iss attribute', () => {
      it('returns false', async () => {
        const result = await validateToken(
          'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6InVuaXRfdGVzdCJ9.eyJhdWQiOiJhdWRfdW5pdF90ZXN0In0.e_SMbgLmlMH7BE2BNQuWr0sChTTjNO7XHIlC7_4GxhDkZhuma5JX7Tz-aj1_X-7ncRFFb21cs96GG_Cr23S_aB9mN9TBnffQmkUmMhbezuXQbtrtWYY0lBggTEXlK5AkuZ9i3SwiYJAiL4CnwRLh_x8G7IcR2XHDYRlEeOKu_Do',
          null,
          ISSUER,
          ALG,
          JWKS_URL,
        );

        expect(result).toBe(false);
      });
    });

    describe('when the token has expired', () => {
      it('throws an ExpiredTokenError error', async () => {
        const resultPromise = validateToken(
          'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6InVuaXRfdGVzdCJ9.eyJhdWQiOiJhdWRfdW5pdF90ZXN0IiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5taWNyb3NvZnRvbmxpbmUuY29tLzE4YTU5YTgxLWVlYTgtNGMzMC05NDhhLWQ4ODI0Y2RjMjU4MC92Mi4wIiwiZXhwIjo5OTk5fQ.zLpH8U4RfDSgiD-sQi-WcHBcuw3UDhq2FRVM9JPhSuCzImUgl0WKZbcAmGa77Ii-hEXbSTpP7AVK3p8rH6SEDuuvCzewXL_kR0cmVePcqu6a1GJF9xmyxrJxzuH9HvVC0WV326oe6QfRu6dbN7DnZU7PUcbYJvmwgAE9XWVKvpQ',
          null,
          ISSUER,
          ALG,
          JWKS_URL,
        );

        await expect(resultPromise).rejects.toThrow(ExpiredTokenError);
      });
    });
  });

  describe('when token kid is not in the JWKS', () => {
    it('returns false', async () => {
      const result = await validateToken(
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiIsImtpZCI6InNvbWVfb3RoZXJfa2lkIn0.eyJhdWQiOiJhdWRfYnV0el90ZXN0IiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5taWNyb3NvZnRvbmxpbmUuY29tLzE4YTU5YTgxLWVlYTgtNGMzMC05NDhhLWQ4ODI0Y2RjMjU4MC92Mi4wIiwiZXhwIjoxNTUxODAzODU0fQ.MY_5fCdN1TFLSnkVGPNpA8qisb_akCnSzCOJZbJAl8sL9OIY6JE9UhQfabd9leCu41J8mCTBDdpZNwzcEWu664tdGTasEbViIjSMdwW17p0s4i6dOptoUjt9ms73nNTnl3KdxJxxwk56QGJ19iUkd3iov595TU1Qe6PbqkUrCgc',
        null,
        ISSUER,
        ALG,
        JWKS_URL,
      );

      expect(result).toBe(false);
    });
  });
});
