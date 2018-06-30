module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('entities', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      unique: 'geo',
      allowNull: false,
      type: Sequelize.STRING,
    },
    desc: {
      type: Sequelize.TEXT('medium'),
    },
    picture: {
      type: Sequelize.TEXT,
    },
    category_id: {
      unique: 'geo',
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    geo: {
      allowNull: false,
      type: Sequelize.GEOMETRY,
    },
    geo_text: {
      unique: 'geo',
      allowNull: false,
      type: Sequelize.STRING(40),
    },
    pref_id: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    city_id: {
      allowNull: false,
      type: Sequelize.INTEGER,
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
  down: queryInterface => queryInterface.dropTable('entities'),
};
