module.exports = (sequelize, Sequelize) => {
  const HydraulicUnit = sequelize.define(
    'HydraulicUnit',
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
      orderID: {
        type: Sequelize.STRING,
        allowNull: false
      },
      partListID: {
        type: Sequelize.STRING,
        allowNull: false
      },
      schematicID: {
        type: Sequelize.STRING,
        allowNull: false
      },
      hydraulicType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdDate: {
        type: Sequelize.BIGINT,
        allowNull: true,
        defaultValue: () => Math.floor(Date.now() / 1000)
      }
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      indexes: [
        {
          unique: true,
          fields: ['orderID'],
        },
      ],
    }
  );

  return HydraulicUnit;
};