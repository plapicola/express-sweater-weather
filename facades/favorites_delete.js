var User = require('../models').User;
var Location = require('../models').Location;
var Favorite = require('../models').Favorite;

module.exports = class FavoritesDeleteFacade {
  constructor(status, body) {
    this.status = status
    this.body = body
  }

  static deleteFavorite(api_key, location) {
    return new Promise((resolve, reject) => {
      Promise.all([
        User.authorize(api_key),
        Location.findOne({ where: { name: location }})
      ])
      .then(([user, location]) => {
        Favorite.destroy({ where: { UserId: user.id, LocationId: location.id }})
      })
      .then(() => {
        resolve(new FavoritesDeleteFacade(204))
      })
      .catch(error => {
        resolve(new FavoritesDeleteFacade(401, error))
      })
    })
  }
}
