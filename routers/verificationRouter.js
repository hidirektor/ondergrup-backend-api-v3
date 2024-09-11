const express = require('express');
const router = express.Router();
const ControllerFactory = require('../controllers/controllerFactory');
const { verifyToken } = require('../middleware');

const verificationController = ControllerFactory.creating('verification.controller');

router.post('/uploadIDPhoto', verifyToken.tokenControl, verificationController.uploadIDPhoto.bind(verificationController));
router.post('/uploadSelfiePhotos', verifyToken.tokenControl, verificationController.uploadSelfiePhotos.bind(verificationController));
router.post('/verifyID', verifyToken.tokenControl, verificationController.verifyID.bind(verificationController));
router.post('/verifySMS', verifyToken.tokenControl, verificationController.verifySMS.bind(verificationController));
router.post('/verifyEmail', verifyToken.tokenControl, verificationController.verifyEmail.bind(verificationController));

module.exports = router;