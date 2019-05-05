var express = require('express');
var router = express.Router();
var User = require('../../../models').User;
var GeocodeService = require('../../../services/geocode');
var ForecastService = require('../../../services/forecast');
require('dotenv').config(); // Loads environment variables from .env file

/* GET forecast for a city */
router.get('/', function(req, res) {
  User.authenticate(req.body.api_key)
  .then(function() {
    return GeocodeService.requestLocation(req.query.location)
  })
  .then(function(location) {
    return ForecastService.requestForecast(location)
  })
  .then(function(forecast) {
    delete forecast.minutely;
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(forecast));
  })
  .catch(error => {
    res.setHeader("Content-Type", "application/json");
    res.status(401).send(JSON.stringify({error: error}))
  })
})

module.exports = router;
