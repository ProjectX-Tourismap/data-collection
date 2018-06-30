module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('temple_data', {
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
    deity: {
      type: Sequelize.TEXT,
    },
    luck: {
      type: Sequelize.TEXT,
    },
    history: {
      type: Sequelize.TEXT,
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
  down: queryInterface => queryInterface.dropTable('temple_data'),
};
