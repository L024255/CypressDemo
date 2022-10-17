class ExpiredTokenError extends Error {
  constructor() {
    super('JWT has expired');
  }
}

module.exports = {
  ExpiredTokenError,
};
