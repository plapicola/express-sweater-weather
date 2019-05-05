var express = require('express');
var router = express.Router();
var UsersCreateFacade = require('../../../facades/users_create');


router.post('/', function(req, res) {
  UsersCreateFacade.createUser(req.body.email, req.body.password, req.body.password_confirmation)
  .then(facade => {
    res.setHeader("Content-Type", "applicatoin/json");
    res.status(facade.status).send(facade.body);
  })
})

module.exports = router;
