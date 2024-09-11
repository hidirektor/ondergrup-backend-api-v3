const redisClient = require('./redisClient');

const generateOTP = async (userName) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const key = `otp_${userName}`;
  await redisClient.set(key, otp, 'EX', 300); // OTP 5 dakika geçerli
  return otp;
};

const verifyOTP = async (userName, otp) => {
  const key = `otp_${userName}`;
  const storedOtp = await redisClient.get(key);
  if (storedOtp && storedOtp === otp) {
    await redisClient.del(key);
    return true;
  }
  return false;
};

module.exports = {
  generateOTP,
  verifyOTP
};