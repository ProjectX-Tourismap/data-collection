module.exports = (sequelize, DataTypes) => {
  const entities = sequelize.define('entities', {
    name: DataTypes.STRING,
    desc: DataTypes.STRING,
    picture: DataTypes.STRING,
    category_id: DataTypes.INTEGER,
    geo: DataTypes.GEOMETRY,
    pref_id: DataTypes.INTEGER,
    city_id: DataTypes.INTEGER,
  }, {});
  entities.associate = (models) => {
    entities.hasMany(models.zoo_data, { foreignKey: 'entity_id' });
    entities.hasMany(models.temple_data, { foreignKey: 'entity_id' });
  };
  return entities;
};
