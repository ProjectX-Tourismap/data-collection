module.exports = (sequelize, DataTypes) => sequelize.define('temple_data', {
  entity_id: {
    unique: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  deity: DataTypes.TEXT,
  luck: DataTypes.TEXT,
  history: DataTypes.TEXT,
}, {});
