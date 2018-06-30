module.exports = (sequelize, DataTypes) => {
  const prefCodes = sequelize.define('pref_codes', {
    name: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING,
    },
  }, {});
  prefCodes.associate = (models) => {
    prefCodes.hasMany(models.entities, { foreignKey: 'pref_id' });
    prefCodes.hasMany(models.city_codes, { foreignKey: 'pref_id' });
  };
  return prefCodes;
};
