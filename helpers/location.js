var Location = require('../models').Location;
var GeocodeService = require('../services/geocode');

module.exports = class LocationHelper {
  static findOrCreateCity(location) {
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
          return GeocodeService.requestLocation(location)
        }
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
}
