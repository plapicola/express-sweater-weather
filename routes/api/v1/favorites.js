var express = require('express');
var router = express.Router();
var FavoritesIndexFacade = require('../../../facades/favorites_index');
var FavoritesDeleteFacade = require('../../../facades/favorites_delete');
var FavoritesCreateFacade = require('../../../facades/favorites_create');

/* GET all favorites for use */
router.get('/', function(req, res) {
  res.setHeader("Content-Type", "application/json");
  FavoritesIndexFacade.getFavorites(req.body.api_key)
  .then(facade => {
    res.status(facade.status).send(facade.body);
  })
  .catch(facade => {
    res.status(500).send(facade.body);
  })
})

/* POST new favorite */
router.post('/', function(req, res) {
  res.setHeader("Content-Type", "application/json");
  FavoritesCreateFacade.createFavorite(req.body.api_key, req.body.location)
  .then(facade => {
    res.status(facade.status).send(facade.body);
  })
  .catch(facade => {
    res.status(500).send(facade.body);
  })
})

/* DELETE a favorite */
router.delete('/', function(req, res) {
  res.setHeader("Content-Type", "application/json");
  FavoritesDeleteFacade.deleteFavorite(req.body.api_key, req.body.location)
  .then(facade => {
    res.status(facade.status).send(facade.body);
  })
  .catch(facade => {
    res.status(500).send(facade.body);
  })
})




module.exports = router;
