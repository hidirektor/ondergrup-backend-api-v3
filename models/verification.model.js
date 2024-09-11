module.exports = (sequelize, Sequelize) => {
  const Verification = sequelize.define(
    'Verification',
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
      idPhoto: {
        type: Sequelize.STRING,
        allowNull: true // ID photo URL, not required
      },
      selfiePhotos: {
        type: Sequelize.STRING, // CSV formatta üç selfie photo URL'si
        allowNull: true
      },
      idVerifiedAt: {
        type: Sequelize.BIGINT, // ID doğrulama zamanını saklayacak (Unix timestamp)
        allowNull: true
      },
      smsVerifiedAt: {
        type: Sequelize.BIGINT, // SMS doğrulama zamanını saklayacak (Unix timestamp)
        allowNull: true
      },
      emailVerifiedAt: {
        type: Sequelize.BIGINT, // Email doğrulama zamanını saklayacak (Unix timestamp)
        allowNull: true
      },
      isIDVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isSMSVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isEmailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        type: Sequelize.BIGINT,
        defaultValue: () => Math.floor(Date.now() / 1000)
      }
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci'
    }
  );

  return Verification;
};