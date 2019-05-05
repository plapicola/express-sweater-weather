var User = require('../models').User;
var GeocodeService = require('../services/geocode');
var ForecastService = require('../services/forecast');

module.exports = class ForecastFacade {
  /* Facade object contains the status and body of the response,
     which is initialized in the static method for the endpoint */
  constructor(status, body) {
    this.status = status
    this.body = body
  }

  static forecastForUser(api_key, location) {
    return new Promise((resolve, reject) => {
      User.authorize(api_key)
      .then(function() {
        return GeocodeService.requestLocation(location)
      })
      .then(function(location) {
        return ForecastService.requestForecast(location)
      })
      .then(function(forecast) {
        delete forecast.minutely;
        resolve(new ForecastFacade(200, forecast)); // Got valid forecast, send 200
      })
      .catch(error => {
        resolve(new ForecastFacade(401, error)); // Bad request, send 401 and error
      })
    })
  }
}
