module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('city_codes', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    pref_id: {
      allowNull: false,
      unique: 'code',
      type: Sequelize.INTEGER,
    },
    city_id: {
      allowNull: false,
      unique: 'code',
      type: Sequelize.INTEGER,
    },
    name: {
      allowNull: false,
      unique: 'code',
      type: Sequelize.STRING,
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
  down: queryInterface => queryInterface.dropTable('city_codes'),
};
