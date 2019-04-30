'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('Users', ['api_key'], {
      type: 'unique',
      name: 'unique_user_apikey_constraint'
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('Users', ['api_key'], {
      type: 'unique',
      name: 'unique_user_apikey_constraint'
    })
  }
};
