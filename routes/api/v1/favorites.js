var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
var User = require('../../../models').User;
var Location = require('../../../models').Location;
var Favorite = require('../../../models').Favorite;
var pry = require('pryjs');

/* GET all favorites for use */
router.get('/', function(req, res) {
  lookupUser(req.body.api_key)
  .then(user => {
    return getFavoritesForecast(user.locations);
  })
  .then(favorites => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(favorites);
  })
  .catch(error => {
    res.setHeader("Content-Type", "application/json");
    res.status(403).send(error);
  })
})

/* POST new favorite */
router.post('/', function(req, res) {
  var foundUser;
  var locationName;
  lookupUser(req.body.api_key)
  .then(user => {
    return new Promise((resolve, reject) => {
      location = user.locations.find(function(element) {
        return element.name == req.body.location;
      })

      location ?
      reject({error: req.body.location + " is already favorited"}) :
      resolve(user)
    })
  })
  .then(user => {
    foundUser = user;
    return findOrCreateCity(req.body.location);
  })
  .then(location => {
    locationName = location.name
    return Favorite.create({
      UserId: foundUser.id,
      LocationId: location.id
    })
  })
  .then(() => {
    res.setHeader("Content-Type", "application/json");
    res.status(201).send(JSON.stringify({message: `${locationName} has been added to your favorites.`}));
  })
  .catch(error => {
    res.setHeader("Content-Type", "application/json");
    res.status(401).send(JSON.stringify({message: "Unable to add location to favorites."}));
  })
})

function lookupUser(api_key) {
  return new Promise((resolve, reject) => {
    User.findOne({
      where: {
        api_key: api_key
      },
      include: 'locations'
    })
    .then(user => {
      user ? resolve(user) : reject("Invalid API Key")
    })
    .catch(error => {
      reject(error)
    })
  })
}

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

function getFavoritesForecast(locations) {
  return Promise.all(locations.map(location => {
    return requestCurrentForecast(location);
  }))
}

function requestCurrentForecast(location) {
  return new Promise((resolve, reject) => {
    fetch(`https://api.darksky.net/forecast/${process.env.DARKSKY_KEY}/${location.latitude},${location.longitude}`)
    .then(request => {
      return request.json();
    })
    .then(result => {
      resolve({
        location: location.name,
        currently: result.currently
      })
    })
    .catch(error => {
      reject(error);
    })
  })
}

module.exports = router;
