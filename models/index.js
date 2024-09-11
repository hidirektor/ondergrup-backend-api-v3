require('dotenv/config.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    dialectOptions: {
      charset: 'utf8',
    },

    define: {
      charset: 'utf8',
      collate: 'utf8_general_ci',
    },

    logging: false
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Include db tables
db.User = require('./user.model.js')(sequelize, Sequelize);
db.ActionLog = require('./action.log.model.js')(sequelize, Sequelize);
db.HydraulicUnit = require('./hydraulic.unit.model.js')(sequelize, Sequelize);
db.Machine = require('./machine.model.js')(sequelize, Sequelize);
db.MachineData = require('./machine.data.model.js')(sequelize, Sequelize);
db.MachineError = require('./machine.error.model.js')(sequelize, Sequelize);
db.OTPLog = require('./otp.log.model.js')(sequelize, Sequelize);
db.ProfilePhoto = require('./profile.photo.model.js')(sequelize, Sequelize);
db.SubUser = require('./sub.user.model.js')(sequelize, Sequelize);
db.SupportTicket = require('./support.ticket.model.js')(sequelize, Sequelize);
db.UserPreferences = require('./user.preferences.model.js')(sequelize, Sequelize);
db.Version = require('./version.model.js')(sequelize, Sequelize);
db.Maintenance = require('./maintenance.model.js')(sequelize, Sequelize);

// Associations
// Users.userID > SubUsers.userID and ownerID
db.User.hasOne(db.SubUser, { foreignKey: 'userID', sourceKey: 'userID', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.User.hasOne(db.SubUser, { foreignKey: 'ownerID', sourceKey: 'userID', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.SubUser.belongsTo(db.User, { foreignKey: 'userID', targetKey: 'userID' });
db.SubUser.belongsTo(db.User, { foreignKey: 'ownerID', targetKey: 'userID' });

// Users.userID > ActionLog.sourceUserID and affectedUserID
db.User.hasMany(db.ActionLog, { foreignKey: 'sourceUserID', sourceKey: 'userID', onUpdate: 'CASCADE' });
db.User.hasMany(db.ActionLog, { foreignKey: 'affectedUserID', sourceKey: 'userID', onUpdate: 'CASCADE' });
db.ActionLog.belongsTo(db.User, { foreignKey: 'sourceUserID', targetKey: 'userID' });
db.ActionLog.belongsTo(db.User, { foreignKey: 'affectedUserID', targetKey: 'userID' });

// Users.userID > Machines.ownerID
db.User.hasMany(db.Machine, { foreignKey: 'ownerID', sourceKey: 'userID', onUpdate: 'CASCADE', onDelete: 'SET NULL' });
db.Machine.belongsTo(db.User, { foreignKey: 'ownerID', targetKey: 'userID' });

// Machines.machineID > MachineData.machineID
db.Machine.hasMany(db.MachineData, { foreignKey: 'machineID', sourceKey: 'machineID', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.MachineData.belongsTo(db.Machine, { foreignKey: 'machineID', targetKey: 'machineID' });

// Machines.machineID > MachineErrors.machineID
db.Machine.hasMany(db.MachineError, { foreignKey: 'machineID', sourceKey: 'machineID', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.MachineError.belongsTo(db.Machine, { foreignKey: 'machineID', targetKey: 'machineID' });

// Users.userID > OTPLog.userID
db.User.hasMany(db.OTPLog, { foreignKey: 'userID', sourceKey: 'userID', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.OTPLog.belongsTo(db.User, { foreignKey: 'userID', targetKey: 'userID' });

// Users.userID > UserPreferences.userID
db.User.hasOne(db.UserPreferences, { foreignKey: 'userID', sourceKey: 'userID', as: 'preferences', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.UserPreferences.belongsTo(db.User, { foreignKey: 'userID', targetKey: 'userID', as: 'user' });

// Users.userID > Maintenances.technicianID
db.User.hasMany(db.Maintenance, { foreignKey: 'technicianID', sourceKey: 'userID', onUpdate: 'CASCADE' });
db.Maintenance.belongsTo(db.User, { foreignKey: 'technicianID', targetKey: 'userID' });

// Machines.machineID > Maintenances.machineID
db.Machine.hasMany(db.Maintenance, { foreignKey: 'machineID', sourceKey: 'machineID', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
db.Maintenance.belongsTo(db.Machine, { foreignKey: 'machineID', targetKey: 'machineID' });

// Machine.machineID > ActionLog.affectedMachineID
db.Machine.hasMany(db.ActionLog, { foreignKey: 'affectedMachineID', sourceKey: 'machineID', onUpdate: 'CASCADE' });
db.ActionLog.belongsTo(db.Machine, { foreignKey: 'affectedMachineID', targetKey: 'machineID' });

// Maintenances.id > ActionLog.affectedMaintenanceID
db.Maintenance.hasMany(db.ActionLog, { foreignKey: 'affectedMaintenanceID', sourceKey: 'id', onUpdate: 'CASCADE' });
db.ActionLog.belongsTo(db.Maintenance, { foreignKey: 'affectedMaintenanceID', targetKey: 'id' });

// Users.userID > SupportTickets.ownerID
db.User.hasMany(db.SupportTicket, { foreignKey: 'ownerID', sourceKey: 'userID', onUpdate: 'CASCADE' });
db.SupportTicket.belongsTo(db.User, { foreignKey: 'ownerID', targetKey: 'userID' });

module.exports = db;