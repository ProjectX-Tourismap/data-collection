module.exports = (sequelize, DataTypes) => {
  const zoo_events = sequelize.define('zoo_events', {
    zoo_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    desc: DataTypes.STRING,
    location: DataTypes.STRING,
    start_time: DataTypes.DATE,
    end_time: DataTypes.DATE,
  }, {});
  return zoo_events;
};
