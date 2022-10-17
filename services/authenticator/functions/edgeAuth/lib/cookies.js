const cookie = require('cookie');

const COOKIE_NAME_ACCESS_TOKEN = 'accessToken';
const COOKIE_NAME_ID_TOKEN = 'idToken';
const COOKIE_NAME_NONCE = 'nonce';
const COOKIE_NAME_REFRESH_TOKEN = 'refreshToken';

const COOKIE_OPTIONS_CLEAR = {
  path: '/',
  expires: new Date(1970, 1, 1, 0, 0, 0, 0),
};

const COOKIE_OPTIONS_SET = {
  httpOnly: false,
  // secure: true,
  maxAge: 3600, // 1 hour
};

function buildCookieHeader(name, value, options = COOKIE_OPTIONS_SET) {
  return {
    key: 'Set-Cookie',
    value: cookie.serialize(name, value, options),
  };
}

module.exports = {
  COOKIE_NAME_ACCESS_TOKEN,
  COOKIE_NAME_ID_TOKEN,
  COOKIE_NAME_NONCE,
  COOKIE_NAME_REFRESH_TOKEN,
  COOKIE_OPTIONS_CLEAR,
  COOKIE_OPTIONS_SET,
  buildCookieHeader,
  parse: cookie.parse,
};
