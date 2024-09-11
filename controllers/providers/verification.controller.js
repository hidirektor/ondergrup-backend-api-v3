const db = require('../../models');
const HttpStatusCode = require('http-status-codes');
const StorageFactory = require('../../utils/storage/storageFactory');

const storageUtil = StorageFactory.create('minioStorage', {
  endPoint: process.env.MINIO_ENDPOINT,
  port: process.env.MINIO_PORT,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY
});

const bucketName = process.env.BUCKET_NAME;

class VerificationController {
  constructor() {}

  async uploadIDPhoto(req, res) {
    try {
      const { userID, file, fileName } = req.body;
      const uploadResult = await storageUtil.uploadAsync({
        file: Buffer.from(file, 'base64'),
        fileName: fileName,
        filePath: bucketName
      });

      const verification = await db.Verification.findOne({ where: { userID } });
      if (verification) {
        verification.idPhoto = fileName;
        await verification.save();
      } else {
        await db.Verification.create({
          userID,
          idPhoto: fileName
        });
      }

      res.status(HttpStatusCode.OK).json({ message: 'ID photo uploaded successfully', etag: uploadResult });
    } catch (err) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error uploading ID photo', error: err.message });
    }
  }

  async uploadSelfiePhotos(req, res) {
    try {
      const { userID, selfies } = req.body;

      let savedSelfies = [];

      for (const [index, file] of selfies.entries()) {
        const fileName = `selfie_${index + 1}.jpg`;
        const uploadResult = await storageUtil.uploadAsync({
          file: Buffer.from(file, 'base64'),
          fileName: fileName,
          filePath: bucketName
        });
        savedSelfies.push(fileName);
      }

      const verification = await db.Verification.findOne({ where: { userID } });
      if (verification) {
        verification.selfiePhotos = savedSelfies.join(',');
        await verification.save();
      } else {
        await db.Verification.create({
          userID,
          selfiePhotos: savedSelfies.join(',')
        });
      }

      res.status(HttpStatusCode.OK).json({ message: 'Selfie photos uploaded successfully' });
    } catch (err) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error uploading selfie photos', error: err.message });
    }
  }

  async verifyID(req, res) {
    try {
      const { userID } = req.body;
      const verification = await db.Verification.findOne({ where: { userID } });

      if (!verification || !verification.idPhoto || !verification.selfiePhotos) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'ID and three selfie photos are required for verification.' });
      }

      const idPhotoPath = verification.idPhoto;
      const selfiePaths = verification.selfiePhotos.split(',');

      const isVerified = await this.comparePhotos(idPhotoPath, selfiePaths);

      verification.isIDVerified = isVerified;
      verification.idVerifiedAt = isVerified ? Math.floor(Date.now() / 1000) : null;
      await verification.save();

      res.status(HttpStatusCode.OK).json({ message: 'Verification process completed', isVerified });
    } catch (err) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error during verification process', error: err.message });
    }
  }

  comparePhotos(idPhotoPath, selfiePaths) {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python3', [path.join(__dirname, 'compare_faces.py'), idPhotoPath, ...selfiePaths]);

      pythonProcess.stdout.on('data', (data) => {
        const result = data.toString().trim();
        resolve(result === 'True');
      });

      pythonProcess.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
        reject(data.toString());
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          reject(`Python process exited with code ${code}`);
        }
      });
    });
  }

  async verifySMS(req, res) {
    try {
      const { userID, otp } = req.body;
      const verification = await db.Verification.findOne({ where: { userID } });

      if (!verification) {
        return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Verification record not found.' });
      }

      // SMS doğrulama işlemi burada yapılacak (OTP kontrolü vs.)

      verification.isSMSVerified = true;
      verification.smsVerifiedAt = Math.floor(Date.now() / 1000);
      await verification.save();

      res.status(HttpStatusCode.OK).json({ message: 'SMS verification successful' });
    } catch (err) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error during SMS verification', error: err.message });
    }
  }

  async verifyEmail(req, res) {
    try {
      const { userID, token } = req.body;
      const verification = await db.Verification.findOne({ where: { userID } });

      if (!verification) {
        return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Verification record not found.' });
      }

      // Email doğrulama işlemi burada yapılacak (Token kontrolü vs.)

      verification.isEmailVerified = true;
      verification.emailVerifiedAt = Math.floor(Date.now() / 1000);
      await verification.save();

      res.status(HttpStatusCode.OK).json({ message: 'Email verification successful' });
    } catch (err) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error during email verification', error: err.message });
    }
  }
}

module.exports = VerificationController;