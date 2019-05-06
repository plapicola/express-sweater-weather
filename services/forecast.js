var fetch = require('node-fetch');
require('dotenv').config(); // Loads environment variables from .env file


module.exports = class ForecastService {
  static requestForecast(location) {
    return new Promise((resolve, reject) => {
      fetch(`https://api.darksky.net/forecast/${process.env.DARKSKY_KEY}/${location.latitude},${location.longitude}`)
      .then(response => response.json())
      .then(result => resolve(result))
      .catch(error => reject(error))
    })
  }

  static requestCurrentForecast(location) {
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
}
