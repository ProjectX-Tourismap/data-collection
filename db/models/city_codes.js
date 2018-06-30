module.exports = (sequelize, DataTypes) => {
  const cityCodes = sequelize.define('city_codes', {
    pref_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  }, {});
  cityCodes.associate = (models) => {
    cityCodes.hasMany(models.entities, { foreignKey: 'city_id' });
  };
  return cityCodes;
};
