var express = require('express');
var router = express.Router();
var ForecastFacade = require('../../../facades/forecast');

/* GET forecast for a city */
router.get('/', function(req, res) {
  ForecastFacade.forecastForUser(req.body.api_key, req.query.location)
  .then(forecast => {
    res.setHeader("Content-Type", "application/json");
    res.status(forecast.status).send(forecast.body);
  })
})

module.exports = router;
