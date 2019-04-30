var express = require('express');
var router = express.Router();
var User = require('../../../models').User;
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post('/', function(req, res) {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
  .then(user => {
    bcrypt.compare(req.body.password, user.password_digest, function(err, match) {
      if (match) {
        res.setHeader("Content-Type", "application/json");
        res.status(200).send(JSON.stringify({api_key: user.api_key}));
      } else {
        res.setHeader("Content-Type", "application/json");
        res.status(401).send(JSON.stringify({error: "Invalid email or password"}));
      }
    })
  })
  .catch(error => {
    res.setHeader("Content-Type", "application/json");
    res.status(401).send(JSON.stringify({error: "Invalid email or password"}));
  })
});

module.exports = router;
