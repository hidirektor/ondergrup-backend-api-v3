const express = require('express');
const router = express.Router();
const ControllerFactory = require('../controllers/controllerFactory');
const { verifyToken } = require('../middleware');

const fileController = ControllerFactory.creating('file.controller');

router.post('/getFile', verifyToken.tokenControl, fileController.getFile.bind(fileController));
router.post('/uploadFile', verifyToken.tokenControl, fileController.uploadFile.bind(fileController));
router.post('/downloadFile', verifyToken.tokenControl, fileController.downloadFile.bind(fileController));
router.delete('/deleteFile', verifyToken.tokenControl, fileController.deleteFile.bind(fileController));

module.exports = router;