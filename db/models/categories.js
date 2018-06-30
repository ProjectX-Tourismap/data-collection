module.exports = (sequelize, DataTypes) => {
  const categories = sequelize.define('categories', {
    name: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING,
    },
  }, {});
  categories.associate = (models) => {
    categories.hasMany(models.entities, { foreignKey: 'category_id' });
  };
  return categories;
};
