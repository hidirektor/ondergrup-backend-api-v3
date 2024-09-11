module.exports = (sequelize, Sequelize) => {
  const Machine = sequelize.define(
    'Machine',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      machineID: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      ownerID: {
        type: Sequelize.STRING,
        allowNull: true
      },
      machineType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ownerLat: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      ownerLong: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: () => Math.floor(Date.now() / 1000)
      },
      lastUpdate: {
        type: Sequelize.BIGINT,
        allowNull: true,
        defaultValue: null
      }
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci'
    }
  );

  return Machine;
};