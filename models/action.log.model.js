module.exports = (sequelize, Sequelize) => {
  const ActionLog = sequelize.define(
    'ActionLog',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      sourceUserID: {
        type: Sequelize.STRING,
        allowNull: false
      },
      sourceNameSurname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      affectedUserID: {
        type: Sequelize.STRING,
        allowNull: true
      },
      affectedUserName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      affectedNameSurname: {
        type: Sequelize.STRING,
        allowNull: true
      },
      affectedMachineID: {
        type: Sequelize.STRING,
        allowNull: true
      },
      affectedMaintenanceID: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      affectedHydraulicUnitID: {
        type: Sequelize.STRING,
        allowNull: true
      },
      operationPlatform: {
        type: Sequelize.STRING,
        allowNull: false
      },
      operationType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      operationName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      operationTime: {
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

  return ActionLog;
};