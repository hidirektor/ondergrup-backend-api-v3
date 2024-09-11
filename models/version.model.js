module.exports = (sequelize, Sequelize) => {
  const Version = sequelize.define(
    'Version',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      versionTitle: {
        type: Sequelize.STRING,
        allowNull: false
      },
      versionDesc: {
        type: Sequelize.STRING,
        allowNull: false
      },
      versionCode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      versionID: {
        type: Sequelize.STRING,
        allowNull: false
      },
      releaseDate: {
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

  return Version;
};