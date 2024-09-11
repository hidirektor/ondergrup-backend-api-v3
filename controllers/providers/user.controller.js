const db = require('../../models');
const HttpStatusCode = require('http-status-codes');
const GenericCRUD = require('../genericCrud');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const Authorization = require('../../middleware/authorization');
const { isEmptyCheck } = require('../../utils/helper');
const StorageFactory = require('../../utils/storage/storageFactory');
const userCrud = new GenericCRUD({ model: db.User, where: null });
const preferencesCrud = new GenericCRUD({ model: db.UserPreferences, where: null });

class UserController {
  constructor() {}

  // Tüm kullanıcıları ve preferences'larını döndürür (ENGINEER ve SYSOP)
  async getAllUsersAsync(req, res) {
    if (!Authorization.isEngineerOrSysop(req)) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: 'Unauthorized' });
    }

    try {
      const users = await db.User.findAll({
        include: [{ model: db.UserPreferences, as: 'preferences' }]
      });
      res.status(HttpStatusCode.OK).json({ status: true, users });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
  }

  // Kullanıcının kendisine ait preferences verilerini döndürür
  async getPreferencesAsync(req, res) {
    const { userID } = req.body;
    if (req.decode.userID !== userID) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: 'Unauthorized' });
    }

    try {
      const preferences = await preferencesCrud.findOne({ userID });
      res.status(HttpStatusCode.OK).json({ status: true, preferences });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
  }

  // Kullanıcının kendi profil verilerini döndürür
  async getProfileAsync(req, res) {
    const { userID } = req.body;
    if (req.decode.userID !== userID) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: 'Unauthorized' });
    }

    try {
      const user = await userCrud.findOne({ userID });
      res.status(HttpStatusCode.OK).json({ status: true, user });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
  }

  // Kullanıcının profil fotoğrafını döndürür
  async getProfilePhotoAsync(req, res) {
    const { userName } = req.params;
    if (req.decode.userName !== userName) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: 'Unauthorized' });
    }

    try {
      const profilePhoto = await db.ProfilePhoto.findOne({ where: { userName } });
      res.status(HttpStatusCode.OK).json({ status: true, profilePhoto });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
  }

  // Kullanıcının preferences verilerini günceller
  async updatePreferencesAsync(req, res) {
    const { userID, preferencesData } = req.body;
    if (req.decode.userID !== userID) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: 'Unauthorized' });
    }

    try {
      const updatedPreferences = await preferencesCrud.update({ userID }, preferencesData);
      res.status(HttpStatusCode.OK).json({ status: true, preferences: updatedPreferences });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
  }

  // Kullanıcının profil verilerini günceller
  async updateProfileAsync(req, res) {
    const { userID, userData } = req.body;
    if (req.decode.userID !== userID) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: 'Unauthorized' });
    }

    try {
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
      }
      const updatedUser = await userCrud.update({ userID }, userData);
      res.status(HttpStatusCode.OK).json({ status: true, user: updatedUser });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
  }

  // Kullanıcı durumunu günceller (ENGINEER ve SYSOP)
async updateUserStatusAsync(req, res) {
  if (!Authorization.isEngineerOrSysop(req)) {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: 'Unauthorized' });
  }

  try {
    const { userName, isActive } = req.body;

    // Kullanıcıyı bul ve durumunu güncelle
    const updatedUser = await userCrud.update({ userName }, { isActive });

    // Eğer güncelleme başarılıysa kullanıcıyı geri döndür
    res.status(HttpStatusCode.OK).json({ status: true, user: updatedUser });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
  }
}

  // Kullanıcının profil fotoğrafını günceller
  async uploadProfilePhotoAsync(req, res) {
    const { userName } = req.body;
    if (req.decode.userName !== userName) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: 'Unauthorized' });
    }

    try {
      const minioStorage = StorageFactory.create('minio', { endPoint: process.env.MINIO_ENDPOINT });
      const { file } = req.body; // multi-part request handling
      const fileName = `${userName}_profile.png`;

      // Eski profil fotoğrafını sil
      await minioStorage.removeAsync({ fileName });

      // Yeni fotoğrafı yükle
      const uploadResult = await minioStorage.uploadAsync({
        file,
        fileName,
        filePath: 'profile-photos',
        metaData: { 'Content-Type': 'image/png' }
      });

      res.status(HttpStatusCode.OK).json({ status: true, message: 'Profile photo updated.', uploadResult });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
  }

  // Kullanıcı ekler (ENGINEER ve SYSOP)
  async addUserAsync(req, res) {
    if (!Authorization.isEngineerOrSysop(req)) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: 'Unauthorized' });
    }

    try {
      const newUser = await userCrud.create(req.body);
      res.status(HttpStatusCode.CREATED).json({ status: true, user: newUser });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
  }

  // Kullanıcı siler (ENGINEER ve SYSOP)
  async deleteUserAsync(req, res) {
    if (!Authorization.isEngineerOrSysop(req)) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: 'Unauthorized' });
    }

    try {
      const { userName } = req.body;
      const deletedUser = await db.User.destroy({ where: { userName } });
      res.status(HttpStatusCode.OK).json({ status: true, user: deletedUser });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
  }

  // Kullanıcı durumunu günceller (ENGINEER ve SYSOP)
  async changeUserStatusAsync(req, res) {
    if (!Authorization.isEngineerOrSysop(req)) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: 'Unauthorized' });
    }

    try {
      const { userName, isActive } = req.body;
      const updatedUser = await userCrud.update({ userName }, { isActive });
      res.status(HttpStatusCode.OK).json({ status: true, user: updatedUser });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
  }

  // Kullanıcı rolünü günceller (ENGINEER ve SYSOP)
  async updateRoleAsync(req, res) {
    if (!Authorization.isEngineerOrSysop(req)) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: 'Unauthorized' });
    }

    try {
      const { userName, newRole } = req.body;
      const updatedUser = await userCrud.update({ userName }, { userType: newRole });
      res.status(HttpStatusCode.OK).json({ status: true, user: updatedUser });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
  }

  // Kullanıcıyı günceller (ENGINEER ve SYSOP)
  async updateUserAsync(req, res) {
    if (!Authorization.isEngineerOrSysop(req)) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: 'Unauthorized' });
    }

    try {
      const { userID, userData } = req.body;
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
      }
      const updatedUser = await userCrud.update({ userID }, userData);
      res.status(HttpStatusCode.OK).json({ status: true, user: updatedUser });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
  }
}

module.exports = UserController;