var User = require('../models').User;

module.exports = class SessionsCreateFacade {
  constructor(status, body) {
    this.status = status
    this.body = body
  }

  static authenticateUser(email, password) {
    return new Promise((resolve, reject) => {
      User.authenticate(email, password)
      .then(user => {
        user ?
        resolve(new SessionsCreateFacade(200, {api_key: user.api_key})) :
        resolve(new SessionsCreateFacade(401, {error: "Invalid email or password"}))
      })
      .catch(error => {
        reject(new SessionsCreateFacade(500, error));
      })
    })
  }
}
