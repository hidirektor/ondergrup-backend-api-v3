const Storage = require("../base/storage");
const Minio = require("minio");
const {config} = require("../../config");
const {MINIO_GENERIC_BUCKET_NAME} = require("../../constants");


class MinioStorage extends Storage {
  constructor({ endPoint, accessKey, secretKey, useSSL = false, port }) {
    super();
    this.minioClient = new Minio.Client({
      endPoint,
      accessKey,
      secretKey,
      useSSL,
      port: parseInt(port),
    });
  }

  async uploadAsync({
                      file,
                      fileName,
                      filePath = MINIO_GENERIC_BUCKET_NAME,
                      metaData = {'Content-type': 'image/png'}
                    }) {
    return new Promise((resolve, reject) => {
      this.minioClient.putObject(
        filePath,
        fileName,
        file,
        metaData,
        function (err, etag) {
          if (err) reject(err);
          resolve(etag);
        }
      );
    });
  }

  async removeAsync({fileName, filePath = MINIO_GENERIC_BUCKET_NAME}) {
    return new Promise((resolve, reject) => {
      this.minioClient.removeObject(filePath, fileName, function (err) {
        if (err) reject(err);
        resolve({ status: true });
      });
    });
  }

  async getPresignedUrl({
                          fileName,
                          minioBucketName = MINIO_GENERIC_BUCKET_NAME
                        }) {
    return new Promise((resolve, reject) => {
      this.minioClient.presignedUrl('GET', minioBucketName, fileName, function (err, presignedUrl) {
        if (err) reject(err);
        resolve(presignedUrl);
      });
    });
  }

  async downloadFile({fileName, filePath = MINIO_GENERIC_BUCKET_NAME}) {
    return new Promise((resolve, reject) => {
      this.minioClient.getObject(filePath, fileName, (err, stream) => {
        if (err) reject(err);
        resolve(stream);
      });
    });
  }
}

module.exports = MinioStorage;