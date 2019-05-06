# Sweater Weather Express

### Introduction

Sweater Weather Express is a backend application written in Express.js designed to supply formatted JSON API endpoints. The application is designed to a provided specification for integration with a potential future frontend, and is expected to manage a database of users who will be authenticated using a unique API key, make forecast requests for city queries on behalf of authenticated users, and manage favorited locations on behalf of authenticated users.

### How to use

The following dependencies are required:
- Node.js
- Express.js
- PostgreSQL

##### Initial Setup

``` bash
npm install # Install dependencies
npx sequelize db:create # Create PostgreSQL Database
npx sequelize db:migrate # Run migrations for database setup
```

Additionally, you will be required to obtain API keys for the following services:

- Google Maps
- Dark Sky

These API keys will need to be stored in a `.env` file located at the root of the project, with the following format:

```
GOOGLE_GEOCODE_KEY=<YOUR_GOOGLE_MAPS_KEY_HERE>
DARKSKY_KEY=<YOUR_DARKSKY_KEY_HERE>
```

This file will be parsed by the application using the `dotenv` package to load them in to environment variables, and are required for making requests to the Geocoding and Forecast services.

##### Using the application

Once initial setup is completed the application can be executed using `npm start`.

The application provides the following endpoints:

###### User Creation

New user accounts can be registered via a `POST` request to the `/api/v1/users` endpoint. The request must contain an email (unique in the system), password, and password confirmation matching the format provided below.

``` HTTP
POST /api/v1/users
Content-Type: application/json
Accept: application/json

{
  "email": "peter@lapicola.com",
  "password": "password"
  "password_confirmation": "password"
}
```

The application will return the API key for the newly created user if the request is successful, along with a status code of 201.

``` HTTP
status: 201
body:

{
  "api_key": "1a46d0f47e622496255c3ed9b08fef67",
}
```

In the event that the request is unsuccessful, the application will return an error message, along with a status code of 401.

``` HTTP
status: 401
body:

{
  "error": "email must be unique"
}
```

###### User login

Existing users can retrieve their API key by submitting a `POST` request to the endpoint `/api/v1/sessions` with their email and password.

``` HTTP
POST /api/v1/sessions
Content-Type: application/json
Accept: application/json

{
  "email": "peter@lapicola.com",
  "password": "password"
}
```

The application will return the API key for the user if the request is successful, along with a status code of 200.

``` HTTP
status: 200
body:

{
  "api_key": "1a46d0f47e622496255c3ed9b08fef67",
}
```

In the event of a failed request, the application responds with a 401 status code and a message indicating the email or password was invalid.

``` HTTP
status: 401
body:

{
    "error": "Invalid email or password"
}
```

###### Requesting a forecast

The application allows authenticated users to request forecasts for a location by submitting a `GET` request to the endpoint `/api/v1/forecast`. A query parameter of `location` indicates the desired location for the forecast, and the user's API key must be provided in the body.

``` HTTP
GET /api/v1/forecast?location=austin,tx
Content-Type: application/json
Accept: application/json

{
  "api_key": "1a46d0f47e622496255c3ed9b08fef67"
}
```

If the request is successful, the application responds with a 200 status, and a forecast object containing the location, current weather (currently), an hourly breakdown (hourly), and a daily forecast (daily). A sample response can be seen below (Only one hourly and daily value are shown).

``` HTTP
status: 200
body:


{
  "location": "Austin, TX, USA",
  "currently": {
      "summary": "Clear",
      "icon": "clear-night",
      "precipIntensity": 0,
      "precipProbability": 0,
      "temperature": 70.8,
      "humidity": 0.85,
      "pressure": 1012.23,
      "windSpeed": 2.77,
      "windGust": 8.01,
      "windBearing": 175,
      "cloudCover": 0.06,
      "visibility": 9.21
  },
  "hourly": {
      "summary": "Mostly cloudy starting later tonight.",
      "icon": "partly-cloudy-day",
      "data": [
          {
              "time": 1557115200,
              "summary": "Clear",
              "icon": "clear-night",
              "precipIntensity": 0,
              "precipProbability": 0,
              "temperature": 71.13,
              "apparentTemperature": 71.91,
              "dewPoint": 66.23,
              "humidity": 0.85,
              "pressure": 1012.13,
              "windSpeed": 2.42,
              "windGust": 7.51,
              "windBearing": 166,
              "cloudCover": 0,
              "uvIndex": 0,
              "visibility": 9.07,
              "ozone": 314.95
          },
          {...}
      ]    
  },
  "daily": {
      "summary": "Rain tomorrow through Saturday, with high temperatures falling to 72°F on Friday.",
      "icon": "rain",
      "data": [
          {
              "time": 1557032400,
              "summary": "Partly cloudy starting in the afternoon, continuing until evening.",
              "icon": "partly-cloudy-day",
              "sunriseTime": 1557056731,
              "sunsetTime": 1557105141,
              "moonPhase": 0.03,
              "precipIntensity": 0,
              "precipIntensityMax": 0.0002,
              "precipIntensityMaxTime": 1557046800,
              "precipProbability": 0,
              "temperatureHigh": 84.25,
              "temperatureHighTime": 1557093600,
              "temperatureLow": 65.1,
              "temperatureLowTime": 1557140400,
              "apparentTemperatureHigh": 85.89,
              "apparentTemperatureHighTime": 1557097200,
              "apparentTemperatureLow": 65.84,
              "apparentTemperatureLowTime": 1557140400,
              "dewPoint": 63.49,
              "humidity": 0.77,
              "pressure": 1011.49,
              "windSpeed": 2.53,
              "windGust": 13.3,
              "windGustTime": 1557100800,
              "windBearing": 132,
              "cloudCover": 0.22,
              "uvIndex": 7,
              "uvIndexTime": 1557082800,
              "visibility": 9.67,
              "ozone": 309.52,
              "temperatureMin": 58.2,
              "temperatureMinTime": 1557057600,
              "temperatureMax": 84.25,
              "temperatureMaxTime": 1557093600,
              "apparentTemperatureMin": 58.29,
              "apparentTemperatureMinTime": 1557057600,
              "apparentTemperatureMax": 85.89,
              "apparentTemperatureMaxTime": 1557097200
          },
          {...},
      ]
   }
}
```

In the event of a bad request, the application responds with a 401 status, and a message that the request failed to include a location and/or API key.

``` HTTP
status: 401
body:

{
  "error": "Missing location and/or API key."
}
```

###### Creating favorites

The application supports the creating of favorite locations for authenticated users via a `POST` request to the `/api/v1/favorites` endpoint. This request must include an API key and a location in the body.

``` HTTP
POST /api/v1/favorites
Content-Type: application/json
Accept: application/json

{
  "api_key": "1a46d0f47e622496255c3ed9b08fef67",
  "location": "Austin, TX"
}
```

A successful response will return with a status code of 201 and a JSON body indicating the name of the city resolved and added to the users favorites.

``` HTTP
status: 201
body:

{
    "message": "Austin, TX, USA has been added to your favorites."
}
```

In the event that the request is unsuccessful, the application will return a 401 status code and a message indicating the request failed (either due to failure to provide an API key or location).

``` HTTP
status: 401
body:

{
    "message": "Unable to add location to favorites."
}
```

###### Retrieving favorites

The application supports returning a list of favorite cities registered for a user by submitting a `GET` request to the endpoint `/api/v1/favorites`. This request must include an API key in the body.

``` HTTP
GET /api/v1/favorites
Content-Type: application/json
Accept: application/json

{
  "api_key": "1a46d0f47e622496255c3ed9b08fef67"
}
```

If successful, the application will return a 200 status along with the list of all the users favorited locations, and the current weather at each location.

``` HTTP
status: 200
body:

[
    {
        "location": "Austin, TX, USA",
        "current_weather": {
            "summary": "Clear",
            "icon": "clear-night",
            "precipIntensity": 0,
            "precipProbability": 0,
            "temperature": 70.31,
            "humidity": 0.85,
            "pressure": 1012.38,
            "windSpeed": 3.38,
            "windGust": 8.76,
            "windBearing": 185,
            "cloudCover": 0.15,
            "visibility": 9.41
        }
    }
]
```

In the event an invalid API key is provided or an API key is not provided, the application will return a 401 status and a message indicating the key was invalid.

``` HTTP
status: 401
body:

{
    "error": "Invalid API Key"
}
```

###### Deleting favorites

The application also supports removal of favorite locations via a `DELETE` request to the endpoint `/api/v1/favorites`. The request must include the location to be deleted and an API key.

``` HTTP
DELETE /api/v1/favorites
Content-Type: application/json
Accept: application/json

{
  "api_key": "1a46d0f47e622496255c3ed9b08fef67",
  "location": "Austin, TX, USA"
}
```

The application will respond with a status of 204 when deleting the favorite.

``` HTTP
status: 204
```

In the event a location or API key is not provided, the application returns a 401 status.

``` HTTP
status: 401
body:

{
  "error": "Invalid API Key"
}
```

##### Known Issues

- The application requires testing backfill

- At this time, the error messaging could be more verbose to better indicate the reason for a bad request on favorite endpoints

- The application should make efforts remove the country abbreviation from some requests

- The application will re-geocode a location if the formatting of a forecast does not match the exact formatting of a resolved address

##### Testing

At this time, the application does not have testing implemented.

##### Contributing

To contribute to this project, please fork and issue a pull request to the master branch with a note indicating changes made.

###### Core Contributors

@plapicola - Author

@tymazey - Reviewer

@aprildagonese - Reviewer

##### Database Schema

![Database Schema](/express-sweater-weather-schema.png)

##### Tech Stack

This application was built using the following technologies:

- Node.js
- Express.js
- Sequelize
- PostgreSQL
- Heroku
