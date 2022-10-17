class OAuthError extends Error {
  constructor(queryParams) {
    super(`Error received from authorization: ${queryParams.error_description || queryParams.error}`);
    this.errorCode = queryParams.error;
    if (queryParams.error_uri) {
      this.helpUri = queryParams.error_uri;
    }
  }
}

module.exports = { OAuthError };
