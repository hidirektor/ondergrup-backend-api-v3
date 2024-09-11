const storageUtils = require('./storageUtils');

class StorageFactory {
  constructor() {}

  static create(provider, args) {
    let storageUtil = storageUtils[provider];
    if (!storageUtil)
      throw new Error(
        'Storage util is not found. Storage util provider: ' + provider
      );
    return new storageUtil(args);
  }
}

module.exports = StorageFactory;
