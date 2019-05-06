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
        return Location.findOrCreate({
          where: {
            name: response.formatted_address,
            latitude: response.geometry.location.lat,
            longitude: response.geometry.location.lng
          }
        })
      })
      .then(function([location, created]) {
        resolve(location)
      })
      .catch(function(error) {
        reject()
      })
    })
  }
}
