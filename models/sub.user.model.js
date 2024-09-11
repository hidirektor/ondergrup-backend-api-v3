module.exports = (sequelize, Sequelize) => {
  const SubUser = sequelize.define(
    'SubUser',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      ownerID: {
        type: Sequelize.STRING,
        allowNull: false
      },
      userID: {
        type: Sequelize.STRING,
        allowNull: false
      }
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci'
    }
  );

  return SubUser;
};