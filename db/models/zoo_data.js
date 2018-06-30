module.exports = (sequelize, DataTypes) => {
  const zooData = sequelize.define('zoo_data', {
    entity_id: {
      unique: true,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    map: DataTypes.TEXT,
    open_time: {
      allowNull: false,
      type: DataTypes.TIME,
    },
    close_time: {
      allowNull: false,
      type: DataTypes.TIME,
    },
  }, {});
  zooData.associate = (models) => {
    zooData.hasMany(models.zoo_events, { foreignKey: 'zoo_id' });
  };
  return zooData;
};
