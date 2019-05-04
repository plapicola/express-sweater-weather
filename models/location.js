'use strict';
module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    name: DataTypes.STRING,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT
  }, {});
  Location.associate = function(models) {
    Location.belongsToMany(models.User, {
      through: models.Favorite,
      as: 'users'
    });
  };
  return Location;
};
