module.exports = (sequelize, DataTypes) => {
  const city_code = sequelize.define('city_code', {
    name: DataTypes.STRING,
  }, {});
  city_code.associate = (models) => {
    city_code.hasMany(models.entities, { foreignKey: 'city_id' });
  };
  return city_code;
};
