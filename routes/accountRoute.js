const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

// Models
const Accounts = require('../models/Account');

router.get('/', upload.none(), (req, res) => {
  const mainData = [];
  Accounts.find({}, (err, object) => {
    for(var i = 0; i < object.length; i++){
      const data = object[i];
      const littleData = {
        name: data.name,
        surname: data.surname
      }
      mainData.push(data);
    }
  });
  setTimeout(() => {
    res.json(mainData);
  }, 1000);
});

router.post('/addData', upload.none(), (req, res) => {
  const {username, password} = req.body;
  console.log(username, password);
  res.json();
});

module.exports = router;