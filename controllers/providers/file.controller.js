const StorageFactory = require('../../utils/storage/storageFactory');
const HttpStatusCode = require('http-status-codes');

const storageUtil = StorageFactory.create('minioStorage', {
  endPoint: process.env.MINIO_ENDPOINT,
  port: process.env.MINIO_PORT,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY
});

const bucketName = process.env.BUCKET_NAME;

class FileController {
  constructor() {}

  async uploadFile(req, res) {
    try {
      const { file, fileName } = req.body;
      const result = await storageUtil.uploadAsync({
        file: Buffer.from(file, 'base64'),
        fileName: fileName,
        filePath: bucketName
      });
      res.status(HttpStatusCode.OK).json({ message: 'File uploaded successfully', etag: result });
    } catch (err) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error uploading file', error: err.message });
    }
  }

  async downloadFile(req, res) {
    try {
      const { fileName } = req.body;
      const stream = await storageUtil.downloadFile({ fileName, filePath: bucketName });
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      stream.pipe(res);
    } catch (err) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error downloading file', error: err.message });
    }
  }

  async getFile(req, res) {
    try {
      const { fileName } = req.body;
      const presignedUrl = await storageUtil.getPresignedUrl({ fileName, minioBucketName: bucketName });
      res.status(HttpStatusCode.OK).json({ url: presignedUrl });
    } catch (err) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error getting file', error: err.message });
    }
  }

  async deleteFile(req, res) {
    try {
      const { fileName } = req.body;
      await storageUtil.removeAsync({ fileName, filePath: bucketName });
      res.status(HttpStatusCode.OK).json({ message: 'File deleted successfully' });
    } catch (err) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error deleting file', error: err.message });
    }
  }
}

module.exports = FileController;