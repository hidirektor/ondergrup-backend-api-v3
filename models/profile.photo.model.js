module.exports = (sequelize, Sequelize) => {
  const ProfilePhoto = sequelize.define(
    'ProfilePhoto',
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
      userName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      fileID: {
        type: Sequelize.STRING,
        allowNull: false
      },
      uploadDate: {
        type: Sequelize.BIGINT,
        allowNull: true,
        defaultValue: () => Math.floor(Date.now() / 1000)
      }
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci'
    }
  );

  return ProfilePhoto;
};