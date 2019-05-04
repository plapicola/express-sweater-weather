'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password_digest: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    api_key: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    User.belongsToMany(models.Location, {
      through: models.Favorite,
      as: 'locations'
   });
  };
  return User;
};
