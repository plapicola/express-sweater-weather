var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
const pry = require('pryjs');
var User = require('../../../models').User;

/* POST new favorite */
router.post('/', function(req, res) {
  var foundUser;
  var locationName;
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
  .then(user => {
    foundUser = user;
    return findOrCreateCity(req.body.location);
  })
})

function findOrCreateCity(location) {
  return new Promise((resolve, reject) => {
    Location.findOne({
      where: {
        name: location
      }
    })
    .then(foundLocation => {
      if (foundLocation) {
        resolve(foundLocation);
      } else {
        return fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.GOOGLE_GEOCODE_KEY}&address=${location}`)
      }
    })
    .then(request => JSON.parse(data).results[0].geometry.location)
    .then(response => {
      eval(pry.it);
      return Location.create({
        name: location,
        latitude: response.lat,
        latitude: response.lng
      })
    })
    .then(function(location) {
      resolve(location)
    })
  })
}

module.exports = router;
