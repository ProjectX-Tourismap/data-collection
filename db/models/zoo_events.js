module.exports = (sequelize, DataTypes) => sequelize.define('zoo_events', {
  zoo_id: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  name: {
    allowNull: false,
    type: DataTypes.TEXT,
  },
  desc: DataTypes.TEXT,
  location: {
    allowNull: false,
    type: DataTypes.TEXT,
  },
  start_time: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  end_time: {
    allowNull: false,
    type: DataTypes.DATE,
  },
}, {});
