module.exports = (sequelize, Sequelize) => {
  const OTPLog = sequelize.define(
    'OTPLog',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      userID: {
        type: Sequelize.STRING,
        allowNull: false
      },
      otp: {
        type: Sequelize.STRING,
        allowNull: true
      },
      otpSentTime: {
        type: Sequelize.BIGINT,
        allowNull: true,
        defaultValue: () => Math.floor(Date.now() / 1000)
      },
      verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    },
    {
      timestamps: false,
      tableName: 'OTPLog',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    }
  );

  return OTPLog;
};