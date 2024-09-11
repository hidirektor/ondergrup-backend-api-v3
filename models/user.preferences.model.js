module.exports = (sequelize, Sequelize) => {
  const UserPreferences = sequelize.define(
    'UserPreferences',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      userID: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      language: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      nightMode: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      mailNotification: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      smsNotification: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      pushNotification: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      }
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci'
    }
  );

  return UserPreferences;
};