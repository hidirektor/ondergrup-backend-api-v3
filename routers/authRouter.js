require('dotenv/config');
const router = require('express')();

const ControllerFactory = require('../controllers/controllerFactory');
const { validators, verifyToken } = require('../middleware');
const authController = ControllerFactory.creating('auth.controller');

const authValidator = validators.authValidator;
const userValidator = validators.userValidator;

const tokenControl = verifyToken.tokenControl;

router.post('/register', authValidator.signUp, authController.signUpAsync);

router.post('/login', authValidator.login, authController.loginAsync);

router.get('/token-decode', tokenControl, authController.tokenDecodeAsync);

router.post(
  '/changePassword',
  tokenControl,
  authController.changePasswordAsync
);

router.post(
  '/resetPassword',
  authValidator.resetPassword,
  authController.resetPasswordAsync
);

router.post('/logout', tokenControl, authController.logoutAsync);

router.post('/confirm-account', userValidator.otpVerification, authController.confirmAccountAsync);

module.exports = router;