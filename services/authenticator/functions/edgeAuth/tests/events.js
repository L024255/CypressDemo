module.exports = {
  initialRequest: {
    Records: [
      {
        cf: {
          config: {
            distributionDomainName: 'd1l1caev0ejgt7.cloudfront.net',
            distributionId: 'EAWGBE34H1ZGT',
            eventType: 'viewer-request',
            requestId: 'Y03GWMYB5f-JgfGpAE5Pcyuw4apqKD4YP0mAPsheTBULwciVswK22w==',
          },
          request: {
            clientIp: '40.248.248.14',
            headers: {
              host: [
                {
                  key: 'Host',
                  value: 'd1l1caev0ejgt7.cloudfront.net',
                },
              ],
            },
            method: 'GET',
            querystring: '',
            uri: '/',
          },
        },
      },
    ],
  },
  authCallbackRequest: {
    Records: [
      {
        cf: {
          config: {
            distributionDomainName: 'd1l1caev0ejgt7.cloudfront.net',
            distributionId: 'EAWGBE34H1ZGT',
            eventType: 'viewer-request',
            requestId: 'Y03GWMYB5f-JgfGpAE5Pcyuw4apqKD4YP0mAPsheTBULwciVswK22w==',
          },
          request: {
            clientIp: '40.248.248.14',
            headers: {
              host: [
                {
                  key: 'Host',
                  value: 'd1l1caev0ejgt7.cloudfront.net',
                },
              ],
            },
            method: 'GET',
            querystring: 'code=abc123&state=https%3A%2F%2Fd1l1caev0ejgt7.cloudfront.net%2F',
            uri: '/_callback',
          },
        },
      },
    ],
  },
  validRequest: {
    Records: [
      {
        cf: {
          config: {
            distributionDomainName: 'd1l1caev0ejgt7.cloudfront.net',
            distributionId: 'EAWGBE34H1ZGT',
            eventType: 'viewer-request',
            requestId: 'Y03GWMYB5f-JgfGpAE5Pcyuw4apqKD4YP0mAPsheTBULwciVswK22w==',
          },
          request: {
            clientIp: '40.248.248.14',
            headers: {
              host: [
                {
                  key: 'Host',
                  value: 'd1l1caev0ejgt7.cloudfront.net',
                },
              ],
              cookie: [
                {
                  key: 'Cookie',
                  value: 'accessToken=test-access-token',
                },
              ],
            },
            method: 'GET',
            querystring: '',
            uri: '/',
          },
        },
      },
    ],
  },
  validExpiredRequest: {
    Records: [
      {
        cf: {
          config: {
            distributionDomainName: 'd1l1caev0ejgt7.cloudfront.net',
            distributionId: 'EAWGBE34H1ZGT',
            eventType: 'viewer-request',
            requestId: 'Y03GWMYB5f-JgfGpAE5Pcyuw4apqKD4YP0mAPsheTBULwciVswK22w==',
          },
          request: {
            clientIp: '40.248.248.14',
            headers: {
              host: [
                {
                  key: 'Host',
                  value: 'd1l1caev0ejgt7.cloudfront.net',
                },
              ],
              cookie: [
                {
                  key: 'Cookie',
                  value: 'accessToken=test-access-token',
                },
              ],
            },
            method: 'GET',
            querystring: '',
            uri: '/',
          },
        },
      },
    ],
  },
};
