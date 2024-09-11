const express = require('express');
const router = express.Router();
const ControllerFactory = require('../controllers/controllerFactory');
const { verifyToken, validators } = require('../middleware');

const userController = ControllerFactory.creating('user.controller');
const userValidator = validators.userValidator;

// Tüm kullanıcıları ve preferences'larını döndürür (ENGINEER ve SYSOP)
router.get('/getAllUsers', verifyToken.tokenControl, userController.getAllUsersAsync);

// Kullanıcının kendi preferences verilerini alır
router.post('/getPreferences', verifyToken.tokenControl, userValidator.bodyId, userController.getPreferencesAsync);

// Kullanıcının kendi profil verilerini alır
router.post('/getProfile', verifyToken.tokenControl, userValidator.bodyId, userController.getProfileAsync);

// Kullanıcının profil fotoğrafını alır
router.get('/getProfilePhoto/:userName', verifyToken.tokenControl, userController.getProfilePhotoAsync);

// Kullanıcının preferences verilerini günceller
router.post('/updatePreferences', verifyToken.tokenControl, userValidator.update, userController.updatePreferencesAsync);

// Kullanıcının profil verilerini günceller
router.post('/updateProfile', verifyToken.tokenControl, userValidator.update, userController.updateProfileAsync);

// Kullanıcının profil fotoğrafını günceller
router.post('/uploadProfilePhoto', verifyToken.tokenControl, userController.uploadProfilePhotoAsync);

// Yeni kullanıcı ekler (ENGINEER ve SYSOP)
router.post('/addUser', verifyToken.tokenControl, userValidator.insert, userController.addUserAsync);

// Kullanıcıyı siler (ENGINEER ve SYSOP)
router.post('/deleteUser', verifyToken.tokenControl, userValidator.find, userController.deleteUserAsync);

// Kullanıcı durumunu günceller (ENGINEER ve SYSOP)
router.post('/updateUserStatus', verifyToken.tokenControl, userValidator.find, userController.updateUserStatusAsync);

// Kullanıcı rolünü günceller (ENGINEER ve SYSOP)
router.post('/updateRole', verifyToken.tokenControl, userValidator.find, userController.updateRoleAsync);

// Kullanıcı profilini günceller (ENGINEER ve SYSOP)
router.put('/updateUser/:id', verifyToken.tokenControl, userValidator.update, userController.updateUserAsync);

module.exports = router;