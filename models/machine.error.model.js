module.exports = (sequelize, Sequelize) => {
  const MachineError = sequelize.define(
    'MachineError',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      machineID: {
        type: Sequelize.STRING,
        allowNull: false
      },
      errorCode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      errorMessage: {
        type: Sequelize.STRING,
        allowNull: false
      },
      errorTime: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: () => Math.floor(Date.now() / 1000)
      }
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci'
    }
  );

  return MachineError;
};