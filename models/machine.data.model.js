module.exports = (sequelize, Sequelize) => {
  const MachineData = sequelize.define(
    'MachineData',
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
      wifiSSID: {
        type: Sequelize.STRING,
        allowNull: true
      },
      wifiPass: {
        type: Sequelize.STRING,
        allowNull: true
      },
      devirmeYuruyusSecim: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      calismaSekli: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      emniyetCercevesi: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      yavaslamaLimit: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      altLimit: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      kapiTablaAcKonum: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      basincSalteri: {
        type: Sequelize.INTEGER,


        allowNull: true
      },
      kapiSecimleri: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      kapiAcTipi: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      kapi1Tip: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      kapi1AcSure: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      kapi2Tip: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      kapi2AcSure: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      kapitablaTip: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      kapiTablaAcSure: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      yukariYavasLimit: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      devirmeYukariIleriLimit: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      devirmeAsagiGeriLimit: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      devirmeSilindirTipi: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      platformSilindirTipi: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      yukariValfTmr: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      asagiValfTmr: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      devirmeYukariIleriTmr: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      devirmeAsagiGeriTmr: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      makineCalismaTmr: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      buzzer: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      demoMode: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      calismaSayisi: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      calismaSayisiDemo: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      dilSecim: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      eepromData38: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      eepromData39: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      eepromData40: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      eepromData41: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      eepromData42: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      eepromData43: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      eepromData44: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      eepromData45: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      eepromData46: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      eepromData47: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      lcdBacklightSure: {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci'
    }
  );

  return MachineData;
};