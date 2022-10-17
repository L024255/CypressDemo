jest.mock('aws-sdk', () => {
  const getParametersByPath = jest.fn();
  return {
    SSM: jest.fn().mockImplementation(() => {
      return { getParametersByPath };
    }),
    ssmMethodMock: getParametersByPath,
  };
});
const AWS = require('aws-sdk');
const parameterStore = require('../lib/parameterStore');


process.env.LOG_LEVEL = 'NONE';

describe('lib/parameterStore', () => {
  afterEach(() => {
    parameterStore.clearCache(true);
  });
  [
    ['getClientId', 'TEST-CLIENT-ID'],
    ['getClientSecret', 'TEST-CLIENT-SECRET'],
    ['getOAuthScope', 'openid test'],
    ['getAudience', 'aud_test'],
  ].forEach(([methodName, expectedOutput]) => {
    describe(methodName, () => {
      describe('before setDistributionId is called', () => {
        it('throw an error', async () => {
          await expect(parameterStore[methodName]()).rejects.toThrow('Unable to load SSM Parameters');
        });
      });

      describe('after setDistributionId is called', () => {
        beforeEach(() => {
          parameterStore.setDistributionId('TEST-ID');

          AWS.ssmMethodMock.mockImplementation(() => {
            return {
              promise: async () => {
                return {
                  Parameters: [
                    { Name: '/TEST-ID/oidc-client-id', Value: 'TEST-CLIENT-ID' },
                    { Name: '/TEST-ID/oidc-client-secret', Value: 'TEST-CLIENT-SECRET' },
                    { Name: '/TEST-ID/oidc-oauth-scope', Value: 'openid test' },
                    { Name: '/TEST-ID/expected-audience', Value: 'aud_test' },
                  ],
                };
              },
            };
          });
        });

        afterEach(() => {
          AWS.ssmMethodMock.mockClear();
        });

        it('returns the SSM Parameter value', async () => {
          await expect(parameterStore[methodName]()).resolves.toEqual(expectedOutput);
          expect(AWS.ssmMethodMock).toHaveBeenCalledTimes(1);
          expect(AWS.ssmMethodMock).toHaveBeenCalledWith({
            Path: '/TEST-ID/',
            Recursive: true,
            WithDecryption: true,
          });
        });

        describe('when the cache expires', () => {
          beforeEach(async () => {
            await parameterStore[methodName]();

            jest.spyOn(Date, 'now').mockReturnValue(Date.now() + (300000 * 2)); // 10 minutes from now
          });

          afterEach(() => {
            Date.now.mockRestore();
          });

          it('reloads the SSM Parameters', async () => {
            await expect(parameterStore[methodName]()).resolves.toEqual(expectedOutput);
            expect(AWS.ssmMethodMock).toHaveBeenCalledTimes(2);
            expect(AWS.ssmMethodMock).toHaveBeenCalledWith({
              Path: '/TEST-ID/',
              Recursive: true,
              WithDecryption: true,
            });
          });
        });

        if (methodName === 'getOAuthScope') {
          it('has a default value', async () => {
            AWS.ssmMethodMock.mockImplementation(() => {
              return {
                promise: async () => {
                  return {
                    Parameters: [],
                  };
                },
              };
            });

            await expect(parameterStore.getOAuthScope()).resolves.toEqual('openid');
            expect(AWS.ssmMethodMock).toHaveBeenCalledTimes(1);
            expect(AWS.ssmMethodMock).toHaveBeenCalledWith({
              Path: '/TEST-ID/',
              Recursive: true,
              WithDecryption: true,
            });
          });
        }

        if (methodName === 'getAudience') {
          it('allows null values', async () => {
            AWS.ssmMethodMock.mockImplementation(() => {
              return {
                promise: async () => {
                  return {
                    Parameters: [],
                  };
                },
              };
            });

            await expect(parameterStore.getAudience()).resolves.toEqual(null);
            expect(AWS.ssmMethodMock).toHaveBeenCalledTimes(1);
            expect(AWS.ssmMethodMock).toHaveBeenCalledWith({
              Path: '/TEST-ID/',
              Recursive: true,
              WithDecryption: true,
            });
          });
        }
        if (['getAudience', 'getOAuthScope'].includes(methodName) === false) {
          it('throws an error if no value is found', async () => {
            AWS.ssmMethodMock.mockImplementation(() => {
              return {
                promise: async () => {
                  return {
                    Parameters: [],
                  };
                },
              };
            });

            await expect(parameterStore[methodName]()).rejects.toThrow(/Unable to load /);
            expect(AWS.ssmMethodMock).toHaveBeenCalledTimes(1);
            expect(AWS.ssmMethodMock).toHaveBeenCalledWith({
              Path: '/TEST-ID/',
              Recursive: true,
              WithDecryption: true,
            });
          });
        }
      });
    });
  });
});
