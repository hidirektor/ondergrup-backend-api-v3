const db = require('../../models');
const HttpStatusCode = require('http-status-codes');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { errorSender } = require('../../utils');
const redisClient = require('../../utils/3rdPartyServices/redis/redisClient');
const { invalidateToken, invalidateAllTokens } = require('../../middleware/authorization');
const GenericCRUD = require('../genericCrud');
const userCrud = new GenericCRUD({ model: db.User, where: null });
const roles = require('../../models/roles');
const { generateOTP, verifyOTP } = require('../../utils/3rdPartyServices/redis/otpService');

class AuthController {
  constructor() {
  }

  async signUpAsync(req, res) {
    const transaction = await db.sequelize.transaction();

    try {
      const findUser = await userCrud.findOne({
        email: req.body.email
      });

      if (findUser.status)
        throw errorSender.errorObject(
          HttpStatusCode.CONFLICT,
          'This email already taken!'
        );
      const insertUser = req.body;
      insertUser.password = bcrypt.hashSync(req.body.password, 8);

      const user = await userCrud.create({
        ...insertUser,
        userType: roles.NORMAL,
        userStatus: true
      });

      if (!user.status)
        throw errorSender.errorObject(
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          'There was a problem adding the user!'
        );

      const userPreferences = await db.UserPreferences.create({
        userID: user.result.userID
      }, { transaction });

      await transaction.commit();

      res.status(HttpStatusCode.OK).json('User registered.');
    } catch (err) {
      res
        .status(err.status || HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send(err.message);
    }
  }

  async loginAsync(req, res) {
    try {
      const findUser = await userCrud.findOne({
        userName: req.body.userName
      });

      if (!findUser.status) {
        throw errorSender.errorObject(
          HttpStatusCode.NOT_FOUND,
          'User not found!'
        );
      }

      const passwordIsValid = await bcrypt.compare(
        req.body.password,
        findUser.result.password
      );

      if (!passwordIsValid) {
        throw errorSender.errorObject(
          HttpStatusCode.BAD_REQUEST,
          'Check your username or password!'
        );
      }

      const payload = {
        userID: findUser.result.userID,
        userType: findUser.result.userType,
        userStatus: findUser.result.userStatus
      };

      const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '7d'
      });

      const deviceInfo = req.body.deviceInfo || req.headers['user-agent'];

      // Redis'te kullanıcı bilgilerini ve token'ı sakla
      const redisKey = `auth_${findUser.result.userID}`;
      const redisValue = JSON.stringify({
        token: accessToken,
        deviceInfo: deviceInfo,
        loginTime: new Date().toISOString(),
        userName: findUser.result.userName,
        userType: findUser.result.userType
      });

      await redisClient.set(redisKey, redisValue);

      res.json({ findUser: findUser.result, accessToken });
    } catch (error) {
      res
        .status(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send(error.message);
    }
  }

  async changePasswordAsync(req, res) {
    const { userName, oldPassword, newPassword, closeSessions } = req.body;

    try {
      const user = await db.User.findOne({ where: { userName } });
      if (!user) return res.status(404).json({ message: 'User not found' });

      const validPassword = await bcrypt.compare(oldPassword, user.password);
      if (!validPassword) return res.status(401).json({ message: 'Invalid current password' });

      const currentTime = Math.floor(Date.now() / 1000);
      if (user.lastPasswordChange && (currentTime - user.lastPasswordChange) < 7 * 24 * 60 * 60) {
        return res.status(400).json({ message: 'Password can only be changed once every 7 days' });
      }

      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        return res.status(400).json({ message: 'New password cannot be the same as the old password' });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      user.lastPasswordChange = currentTime;
      await user.save();

      if (closeSessions) {
        await invalidateAllTokens(user.userID);
      }

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async resetPasswordAsync(req, res) {
    const { userName, newPassword, otpSentTime } = req.body;

    try {
      const user = await db.User.findOne({ where: { userName } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const userID = user.userID;
      const otpLog = await db.OTPLog.findOne({ where: { userID, otpSentTime } });
      if (!otpLog) {
        return res.status(404).json({ message: 'OTP not found' });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      await invalidateAllTokens(user.userID);

      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ message: 'An unexpected error occurred while resetting the password.' });
    }
  }

  async logoutAsync(req, res) {
    const { token } = req.body;

    try {
      await invalidateToken(token);
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error logging out', error });
    }
  }

  async confirmAccountAsync(req, res) {
    const { userName, otp } = req.body;

    try {
      const verified = await verifyOTP(userName, otp);
      if (!verified) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }

      const user = await db.User.findOne({ where: { userName } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.verified = true;
      await user.save();

      res.status(200).json({ message: 'Account confirmed successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error confirming account', error });
    }
  }

  async tokenDecodeAsync(req, res) {
    res.json(req.decode);
  }
}

module.exports = AuthController;