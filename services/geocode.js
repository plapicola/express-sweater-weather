var fetch = require('node-fetch');

module.exports = class GeocodeService {
  static requestLocation(location) {
    return new Promise((resolve, reject) => {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.GOOGLE_GEOCODE_KEY}&address=${location}`)
      .then(response => response.json())
      .then(result => resolve(result.results[0].geometry.location))
      .catch(error => reject(error))
    })
  }
}
