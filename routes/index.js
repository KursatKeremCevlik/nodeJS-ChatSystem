const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/LogIn', (req, res, next) => {
  res.render('LogIn');
});

router.get('/SignIn', (req, res, next) => {
  res.render('chat');
});

router.get('/AdminPage', (req, res, next) => {
  res.render('admin');
});

module.exports = router;
