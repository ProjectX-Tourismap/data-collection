module.exports = (sequelize, DataTypes) => {
  const zoo_data = sequelize.define('zoo_data', {
    entity_id: DataTypes.INTEGER,
    map: DataTypes.STRING,
    open_time: DataTypes.TIME,
    close_time: DataTypes.TIME,
  }, {});
  zoo_data.associate = (models) => {
    zoo_data.hasMany(models.zoo_events, { foreignKey: 'zoo_id' });
  };
  return zoo_data;
};
