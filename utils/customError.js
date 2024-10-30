/* eslint-disable max-classes-per-file */
class XlsxNoFilePathError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.code = 1001;
    this.details = 'Filepath is mandatory for processing xlsx data';
  }
}

class XlsxFileUnavailableError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.code = 1002;
    this.details = 'Given filepath is not found/unavailable';
  }
}

class XlsxUnknownError extends Error {
  constructor(message, error) {
    super(message);
    this.name = this.constructor.name;
    this.code = 1003;
    this.details = 'An unknown error occured';
    this.rootError = error;
  }
}

class XlsxNoBufferError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.code = 1004;
    this.details = 'No Buffer for processing xlsx data';
  }
}

module.exports = {
  XlsxNoFilePathError,
  XlsxFileUnavailableError,
  XlsxUnknownError,
  XlsxNoBufferError,
};
