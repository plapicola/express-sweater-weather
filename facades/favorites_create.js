var User = require('../models').User;
// var Location = require('../models').Location;
var Favorite = require('../models').Favorite;
var GeocodeService = require('../services/geocode');
var LocationHelper = require('../helpers/location');

module.exports = class FavoritesCreateFacade {
  constructor(status, body) {
    this.status = status
    this.body = body
  }

  static createFavorite(api_key, location) {
    var foundUser, locationName;
    return new Promise((resolve, reject) => {
      User.authorize(api_key)
      .then(user => {
        return verifyNotFavorite(user, location)
      })
      .then(user => {
        foundUser = user;
        return LocationHelper.findOrCreateCity(location);
      })
      .then(location => {
        locationName = location.name
        return Favorite.create({
          UserId: foundUser.id,
          LocationId: location.id
        })
      })
      .then(() => {
        resolve(new FavoritesCreateFacade(201, {message: `${locationName} has been added to your favorites.`}))
      })
      .catch(error => {
        resolve(new FavoritesCreateFacade(401, {message: `Unable to add location to favorites.`}))
      })
    })
  }
}

function verifyNotFavorite(user, location) {
  return new Promise((resolve, reject) => {
    location = user.locations.find(function(element) {
      return element.name == location;
    })
    location ?
    reject({error: location + " is already favorited"}) :
    resolve(user)
  })
}
