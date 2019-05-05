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

  User.authorize = function(api_key) {
    return new Promise((resolve, reject) => {
      User.findOne({
        where: {
          api_key: api_key
        }
      })
      .then(user => {
        user ? resolve(user) : reject({error: "Invalid API Key"})
      })
      .catch(error => reject(error))
    })
  }
  return User;
};
