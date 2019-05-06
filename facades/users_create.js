var User = require('../models').User;
var hat = require('hat');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = class UsersCreateFacade {
  constructor(status, body) {
    this.status = status
    this.body = body
  }

  static createUser(email, password, confirmation) {
    return new Promise((resolve, reject) => {
      if (email && password) {
        if (password === confirmation) {
          bcrypt.hash(password, saltRounds, function(err, hash){
            User.create({
              email: email,
              password_digest: hash,
              api_key: hat()
            })
            .then(user => {
              resolve(new UsersCreateFacade(201, {api_key: user.api_key}))
            })
            .catch(error => {
              resolve(new UsersCreateFacade(401, {error: error.errors[0].message}))
            })
          })
        } else {
          resolve(new UsersCreateFacade(401, {error: "Password doesn't match confirmation"}))
        }
      } else {
        resolve(new UsersCreateFacade(401, {error: "Missing fields."}))
      }
    })
  }
}
