var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/LogIn', function(req, res, next) {
  res.render('LogIn');
});

router.get('/SignIn', function(req, res, next) {
  res.render('chat');
});

module.exports = router;
