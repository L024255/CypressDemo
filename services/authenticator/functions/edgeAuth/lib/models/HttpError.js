class HttpError extends Error {
  constructor(message, httpStatus = null, httpStatusText = null, httpBody = null) {
    super(message);

    if (httpStatus != null) {
      this.httpStatus = httpStatus;
    }

    if (httpStatusText != null) {
      this.httpStatusText = httpStatusText;
    }

    if (httpBody != null) {
      this.httpBody = httpBody;
    }
  }
}

module.exports = { HttpError };
