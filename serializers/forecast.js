module.exports = class ForecastSerializer {
  static formatForecast(forecast) {
    return {
      location: forecast.location,
      currently: formatCurrent(forecast.currently),
      hourly: forecast.hourly,
      daily: forecast.daily
    }
  }

  static formatFavorites(favorites) {
    return favorites.map(favorite => {
      return {
        location: favorite.location,
        current_weather: formatCurrent(favorite.currently)
      }
    })
  }
}

function formatCurrent(current) {
  return {
    summary: current.summary,
    icon: current.icon,
    precipIntensity: current.precipIntensity,
    precipProbability: current.precipProbability,
    temperature: current.temperature,
    humidity: current.humidity,
    pressure: current.pressure,
    windSpeed: current.windSpeed,
    windGust: current.windGust,
    windBearing: current.windBearing,
    cloudCover: current.cloudCover,
    visibility: current.visibility
  }
}
