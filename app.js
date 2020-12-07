const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const app = express();
const accountRoutes = require('./routes/accountRoute');
// const URL = 'mongodb+srv://ortakUser:12345@cluster0.vzpif.mongodb.net/chat';
const URL = 'mongodb://localhost/ChatSystem';
const middlewareDB = require('./helper/db')(mongoose, URL, true); // True: connect DataBase

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Css and Js files
app.use('/css/homePage', express.static(path.join(__dirname, '/sheets/css/homePage.css')));
app.use('/css/signupPage', express.static(path.join(__dirname, '/sheets/css/signupPage.css')));
app.use('/css/loginPage', express.static(path.join(__dirname, '/sheets/css/loginPage.css')));
app.use('/css/chatScreen', express.static(path.join(__dirname, '/sheets/css/chatScreen.css')));
app.use('/js/signupPage', express.static(path.join(__dirname, '/sheets/js/signupPage.js')));
app.use('/js/loginPage', express.static(path.join(__dirname, '/sheets/js/loginPage.js')));
app.use('/js/chatScreen', express.static(path.join(__dirname, '/sheets/js/chatScreen.js')));
// Bower and error page
app.use('/jquery/dist/jquery.min.js', express.static(path.join(__dirname, '/bower_components/jquery/dist/jquery.min.js')));
app.use('/semantic/dist/semantic.min.css', express.static(path.join(__dirname, '/bower_components/semantic/dist/semantic.min.css')));
app.use('/css/errorPage', express.static(path.join(__dirname, '/sheets/css/errorPage.css')));
// Images
app.use('/img/instagram', express.static(path.join(__dirname, '/sheets/images/instagram.png')));
app.use('/img/github', express.static(path.join(__dirname, '/sheets/images/github.jpg')));


// Area names
app.get('/', (req, res) => {res.sendFile(__dirname + '/sheets/htmls/homePage.html');});
app.get('/signup', (req, res) => {res.sendFile(__dirname + '/sheets/htmls/signupPage.html');});
app.get('/login', (req, res) => {res.sendFile(__dirname + '/sheets/htmls/loginPage.html');});
app.get('/chat', (req, res) => {res.sendFile(__dirname + '/sheets/htmls/chatScreen.html');});

// Using by test area names
app.post('/test/status', (req, res) => {res.json();});
app.use('/test/accounts', accountRoutes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
  
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json('error');
});

module.exports = app;