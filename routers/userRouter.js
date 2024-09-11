const express = require('express');
const router = express.Router();
const ControllerFactory = require('../controllers/controllerFactory');
const { verifyToken, validators } = require('../middleware');

const userController = ControllerFactory.creating('user.controller');
const userValidator = validators.userValidator;

router.get('/getAllUsers', verifyToken.tokenControl, userController.getAllUsersAsync);

router.post('/getPreferences', verifyToken.tokenControl, userValidator.bodyId, userController.getPreferencesAsync);

router.post('/getProfile', verifyToken.tokenControl, userValidator.bodyId, userController.getProfileAsync);

router.get('/getProfilePhoto/:userName', verifyToken.tokenControl, userController.getProfilePhotoAsync);

router.post('/updatePreferences', verifyToken.tokenControl, userValidator.update, userController.updatePreferencesAsync);

router.post('/updateProfile', verifyToken.tokenControl, userValidator.update, userController.updateProfileAsync);

router.post('/uploadProfilePhoto', verifyToken.tokenControl, userController.uploadProfilePhotoAsync);

router.post('/addUser', verifyToken.tokenControl, userValidator.insert, userController.addUserAsync);

router.post('/deleteUser', verifyToken.tokenControl, userValidator.findByUserName, userController.deleteUserAsync);

router.post('/updateUserStatus', verifyToken.tokenControl, userValidator.findByUserName, userController.updateUserStatusAsync);

router.post('/updateRole', verifyToken.tokenControl, userValidator.find, userController.updateRoleAsync);

router.put('/updateUser/:id', verifyToken.tokenControl, userValidator.update, userController.updateUserAsync);

module.exports = router;