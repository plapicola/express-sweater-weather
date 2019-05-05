var User = require('../models').User;
var ForecastService = require('../services/forecast');
var pry = require('pryjs');

module.exports = class FavoritesIndexFacade {
  constructor(status, body) {
    this.status = status
    this.body = body
  }

  static getFavorites(api_key) {
    return new Promise((resolve, reject) => {
      User.authorize(api_key)
      .then(user => {
        return getFavoritesForecast(user.locations);
      })
      .then(favorites => {
        resolve(new FavoritesIndexFacade(200, favorites));
      })
      .catch(error => {
        resolve(new FavoritesIndexFacade(401, error));
      })
    })
  }
}

function getFavoritesForecast(locations) {
  return Promise.all(locations.map(location => {
    return ForecastService.requestCurrentForecast(location);
  }))
}
