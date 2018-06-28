module.exports = (sequelize, DataTypes) => {
  const temple_data = sequelize.define('temple_data', {
    entity_id: DataTypes.INTEGER,
    deity: DataTypes.STRING,
    luck: DataTypes.STRING,
    history: DataTypes.STRING,
  }, {});
  return temple_data;
};
