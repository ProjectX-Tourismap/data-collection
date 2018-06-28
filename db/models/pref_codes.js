module.exports = (sequelize, DataTypes) => {
  const pref_codes = sequelize.define('pref_codes', {
    name: DataTypes.STRING,
  }, {});
  pref_codes.associate = (models) => {
    pref_codes.hasMany(models.entities, { foreignKey: 'pref_id' });
  };
  return pref_codes;
};
