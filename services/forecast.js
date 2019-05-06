var fetch = require('node-fetch');
require('dotenv').config(); // Loads environment variables from .env file


module.exports = class ForecastService {
  static requestForecast(location) {
    return new Promise((resolve, reject) => {
      fetch(`https://api.darksky.net/forecast/${process.env.DARKSKY_KEY}/${location.latitude},${location.longitude}`)
      .then(response => response.json())
      .then(result => {
        result.location = location.name
        resolve(result)
      })
      .catch(error => reject(error))
    })
  }
}
