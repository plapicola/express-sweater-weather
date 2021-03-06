var fetch = require('node-fetch');
require('dotenv').config(); // Loads environment variables from .env file


module.exports = class GeocodeService {
  static requestLocation(location) {
    return new Promise((resolve, reject) => {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.GOOGLE_GEOCODE_KEY}&address=${location}`)
      .then(response => response.json())
      .then(result => {
        resolve(result.results[0])
      })
      .catch(error => reject(error))
    })
  }
}
