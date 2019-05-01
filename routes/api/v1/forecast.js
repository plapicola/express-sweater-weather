var express = require('express');
var router = express.Router();
var User = require('../../../models').User;
require('dotenv').config(); // Loads environment variables from .env file
const https = require('https');

/* GET forecast for a city */
router.get('/', function(req, res) {
  User.findOne({
    where: {
      api_key: req.body.api_key
    }
  })
  .then(user => {
    return new Promise((resolve, reject) => {
      user ? resolve(user) : reject("Invalid API Key")
    })
  })
  .then(function() {
    return requestLocation(req.query.location)
  })
  .then(function(location) {
    return requestForecast(location)
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

function requestLocation(location) {
  return new Promise((resolve, reject) => {
    https.get(`https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.GOOGLE_GEOCODE_KEY}&address=${location}`, response => {
      let data = '';

      response.on('data', chunk => {
        data += chunk;
      });

      response.on('end', () => {
        resolve((JSON.parse(data).results[0].geometry.location))
      });
    }).on('error', error => {
      reject(error);
    });
  });
}

function requestForecast(location) {
  return new Promise((resolve, reject) => {
    https.get(`https://api.darksky.net/forecast/${process.env.DARKSKY_KEY}/${location.lat},${location.lng}`, response => {
      let data = '';

      response.on('data', chunk => {
        data += chunk;
      });

      response.on('end', () => {
        resolve(JSON.parse(data))
      });
    }).on('error', error => {
      reject(error);
    });
  });
}

module.exports = router;
