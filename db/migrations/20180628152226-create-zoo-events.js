module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('zoo_events', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    zoo_id: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    name: {
      allowNull: false,
      type: Sequelize.TEXT,
    },
    desc: {
      type: Sequelize.TEXT,
    },
    location: {
      allowNull: false,
      type: Sequelize.TEXT,
    },
    start_time: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    end_time: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: queryInterface => queryInterface.dropTable('zoo_events'),
};
