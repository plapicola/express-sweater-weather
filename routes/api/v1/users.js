var express = require('express');
var router = express.Router();
var User = require('../../../models').User;
var hat = require('hat');
const bcrypt = require('bcrypt');
const saltRounds = 10;


router.post('/', function(req, res) {
  if (req.body.email && req.body.password) {
    if (req.body.password === req.body.password_confirmation) {
      bcrypt.hash(req.body.password, saltRounds, function(err, hash){
        User.create({
          email: req.body.email,
          password_digest: hash,
          api_key: hat()
        })
        .then(user => {
          res.setHeader("Content-Type", "application/json");
          res.status(201).send(JSON.stringify({api_key: user.api_key}));
        })
        .catch(error => {
          console.log(error);
          res.setHeader("Content-Type", "application/json");
          res.status(500).send(JSON.stringify({error: error.errors[0].message}));
        })
      })
    } else {
        res.setHeader("Content-Type", "application/json");
        res.status(401).send(JSON.stringify({
          error: "Password doesn't match confirmation"
      }))
    }
  } else {
    res.setHeader("Content-Type", "application/json");
    res.status(401).send(JSON.stringify({
      error: "Missing fields."
    }))
  }
})

module.exports = router;
