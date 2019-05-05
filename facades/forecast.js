var User = require('../models').User;
var GeocodeService = require('../services/geocode');
var ForecastService = require('../services/forecast');

module.exports = class ForecastFacade {
  constructor(status, body) {
    this.status = status
    this.body = body
  }

  static forecastForUser(api_key, location) {
    console.log(location);
    return new Promise((resolve, reject) => {
      User.authorize(api_key)
      .then(function() {
        return GeocodeService.requestLocation(location)
      })
      .then(function(location) {
        console.log(location);
        return ForecastService.requestForecast(location)
      })
      .then(function(forecast) {
        delete forecast.minutely;
        resolve(new ForecastFacade(200, forecast));
      })
      .catch(error => {
        resolve(new ForecastFacade(401, error));
      })
    })
  }
}
