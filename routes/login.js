var express = require('express');
var router = express.Router();

// Models
const Account = require('../models/Account');

router.get('/', function(req, res, next) {
  res.render('LogIn');
});

module.exports = router;
