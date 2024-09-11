module.exports = (sequelize, Sequelize) => {
  const SupportTicket = sequelize.define(
    'SupportTicket',
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
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ticketStatus: {
        type: Sequelize.STRING,
        allowNull: false
      },
      responses: {
        type: Sequelize.TEXT,
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
      collate: 'utf8_general_ci'
    }
  );

  return SupportTicket;
};