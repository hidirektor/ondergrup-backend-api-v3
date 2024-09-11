module.exports = (sequelize, Sequelize) => {
  const Maintenance = sequelize.define(
    'Maintenance',
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
      technicianID: {
        type: Sequelize.STRING,
        allowNull: false
      },
      maintenanceDate: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: () => Math.floor(Date.now() / 1000)
      },
      kontrol11: { type: Sequelize.INTEGER, allowNull: false },
      kontrol12: { type: Sequelize.INTEGER, allowNull: false },
      kontrol13: { type: Sequelize.INTEGER, allowNull: false },
      kontrol14: { type: Sequelize.INTEGER, allowNull: false },
      kontrol21: { type: Sequelize.INTEGER, allowNull: false },
      kontrol22: { type: Sequelize.INTEGER, allowNull: false },
      kontrol23: { type: Sequelize.INTEGER, allowNull: false },
      kontrol24: { type: Sequelize.INTEGER, allowNull: false },
      kontrol31: { type: Sequelize.INTEGER, allowNull: false },
      kontrol32: { type: Sequelize.INTEGER, allowNull: false },
      kontrol33: { type: Sequelize.INTEGER, allowNull: false },
      kontrol34: { type: Sequelize.INTEGER, allowNull: false },
      kontrol35: { type: Sequelize.INTEGER, allowNull: false },
      kontrol36: { type: Sequelize.INTEGER, allowNull: false },
      kontrol41: { type: Sequelize.INTEGER, allowNull: false },
      kontrol42: { type: Sequelize.INTEGER, allowNull: false },
      kontrol43: { type: Sequelize.INTEGER, allowNull: false },
      kontrol44: { type: Sequelize.INTEGER, allowNull: false },
      kontrol45: { type: Sequelize.INTEGER, allowNull: false },
      kontrol46: { type: Sequelize.INTEGER, allowNull: false },
      kontrol51: { type: Sequelize.INTEGER, allowNull: false },
      kontrol52: { type: Sequelize.INTEGER, allowNull: false },
      kontrol53: { type: Sequelize.INTEGER, allowNull: false },
      kontrol54: { type: Sequelize.INTEGER, allowNull: false },
      kontrol55: { type: Sequelize.INTEGER, allowNull: false },
      kontrol56: { type: Sequelize.INTEGER, allowNull: false },
      kontrol61: { type: Sequelize.INTEGER, allowNull: false },
      kontrol62: { type: Sequelize.INTEGER, allowNull: false },
      kontrol63: { type: Sequelize.INTEGER, allowNull: false },
      kontrol71: { type: Sequelize.INTEGER, allowNull: false },
      kontrol72: { type: Sequelize.INTEGER, allowNull: false },
      kontrol81: { type: Sequelize.INTEGER, allowNull: false },
      kontrol82: { type: Sequelize.INTEGER, allowNull: false },
      kontrol83: { type: Sequelize.INTEGER, allowNull: false },
      kontrol91: { type: Sequelize.STRING, allowNull: true },
      kontrol92: { type: Sequelize.STRING, allowNull: true },
      kontrol93: { type: Sequelize.STRING, allowNull: true },
      kontrol94: { type: Sequelize.STRING, allowNull: true },
      kontrol95: { type: Sequelize.STRING, allowNull: true },
      kontrol96: { type: Sequelize.STRING, allowNull: true },
      kontrol97: { type: Sequelize.STRING, allowNull: true },
      kontrol98: { type: Sequelize.STRING, allowNull: true },
      kontrol99: { type: Sequelize.STRING, allowNull: true },
      kontrol910: { type: Sequelize.STRING, allowNull: true }
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci'
    }
  );

  return Maintenance;
};