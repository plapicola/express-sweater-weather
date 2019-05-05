var express = require('express');
var router = express.Router();
var SessionsCreateFacade = require('../../../facades/sessions_create');

router.post('/', function(req, res) {
  res.setHeader("Content-Type", "application/json");
  SessionsCreateFacade.authenticateUser(req.body.email, req.body.password)
  .then(facade => {
    res.status(facade.status).send(facade.body);
  })
  .catch(facade => {
    res.status(facade.status).send(facade.body);
  })
});

module.exports = router;
