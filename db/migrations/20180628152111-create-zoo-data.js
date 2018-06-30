module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('zoo_data', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    entity_id: {
      unique: true,
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    map: {
      type: Sequelize.TEXT,
    },
    open_time: {
      allowNull: false,
      type: Sequelize.TIME,
    },
    close_time: {
      allowNull: false,
      type: Sequelize.TIME,
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
  down: queryInterface => queryInterface.dropTable('zoo_data'),
};
