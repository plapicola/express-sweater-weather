var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
const pry = require('pryjs');
var User = require('../../../models').User;
var Location = require('../../../models').Location;
var Favorite = require('../../../models').Favorite;

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
  .then(city => {
    eval(pry.it);
    locationName = city.name
    return Favorite.create({
      UserId: foundUser.id,
      CityId: city.id
    })
  })
  .then(() => {
    res.setHeader("Content-Type", "application/json");
    res.status(201).send(JSON.stringify({message: `${locationName} has been added to your favorites.`}));
  })
  .catch(error => {
    console.log(error)
    eval(pry.it);
    res.setHeader("Content-Type", "application/json");
    res.status(401).send(JSON.stringify({message: "Unable to add location to favorites"}));
  })
})

function findOrCreateCity(location) {
  return new Promise((resolve, reject) => {
    Location.findOne({
      where: {
        name: location
      }
    })
    .then(function(foundLocation) {
      if (foundLocation) {
        resolve(foundLocation);
      } else {
        return fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.GOOGLE_GEOCODE_KEY}&address=${location}`)
      }
    })
    .then(request => {
      return request.json();
    })
    .then(result => {
      return result.results[0].geometry.location
    })
    .then(response => {
      return Location.create({
        name: location,
        latitude: response.lat,
        longitude: response.lng
      })
    })
    .then(function(location) {
      resolve(location)
    })
    .catch(function(error) {
      reject()
    })
  })
}

module.exports = router;
