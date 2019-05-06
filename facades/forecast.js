var User = require('../models').User;
var GeocodeService = require('../services/geocode');
var ForecastService = require('../services/forecast');
var LocationHelper = require('../helpers/location');
var ForecastSerializer = require('../serializers/forecast');
var pry = require('pryjs');

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
        return LocationHelper.findOrCreateCity(location)
      })
      .then(function(location) {
        return ForecastService.requestForecast(location)
      })
      .then(function(forecast) {
        let formattedForecast = ForecastSerializer.formatForecast(forecast)
        resolve(new ForecastFacade(200, formattedForecast)); // Got valid forecast, send 200
      })
      .catch(error => {
        resolve(new ForecastFacade(401, {error: "Invalid API Key"})); // Bad request, send 401 and error
      })
    })
  }
}
