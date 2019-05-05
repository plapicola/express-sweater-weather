var fetch = require('node-fetch');

module.exports = class ForecastService {
  static requestForecast(location) {
    return new Promise((resolve, reject) => {
      fetch(`https://api.darksky.net/forecast/${process.env.DARKSKY_KEY}/${location.lat},${location.lng}`)
      .then(response => response.json())
      .then(result => resolve(result))
      .catch(error => reject(error))
    })
  }
}
