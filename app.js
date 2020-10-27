const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const app = express();

// const URL = 'mongodb+srv://ortakUser:12345@cluster0.vzpif.mongodb.net/chat';
const URL = 'mongodb://localhost/ChatSystem';
const middlewareDB = require('./helper/db')(mongoose, URL);

app.get('/', (req, res) => {res.sendFile(__dirname + '/sheets/htmls/homePage.html');});
app.get('/signup', (req, res) => {res.sendFile(__dirname + '/sheets/htmls/signupPage.html');});
app.get('/login', (req, res) => {res.sendFile(__dirname + '/sheets/htmls/loginPage.html');});
app.get('/chat', (req, res) => {res.sendFile(__dirname + '/sheets/htmls/chatScreen.html');});

app.use('/css/homePage', express.static(path.join(__dirname, '/sheets/css/homePage.css')));
app.use('/css/signupPage', express.static(path.join(__dirname, '/sheets/css/signupPage.css')));
app.use('/css/loginPage', express.static(path.join(__dirname, '/sheets/css/loginPage.css')));
app.use('/css/chatScreen', express.static(path.join(__dirname, '/sheets/css/chatScreen.css')));
app.use('/js/signupPage', express.static(path.join(__dirname, '/sheets/js/signupPage.js')));
app.use('/js/loginPage', express.static(path.join(__dirname, '/sheets/js/loginPage.js')));
app.use('/js/chatScreen', express.static(path.join(__dirname, '/sheets/js/chatScreen.js')));

app.use('/jquery/dist/jquery.min.js', express.static(path.join(__dirname, '/bower_components/jquery/dist/jquery.min.js')));
app.use('/semantic/dist/semantic.min.css', express.static(path.join(__dirname, '/bower_components/semantic/dist/semantic.min.css')));

const expressOprt = require('./operations/expressOprt')(app, express, logger, cookieParser, path);
app.use(function (req, res, next) {res.sendFile(__dirname + '/sheets/htmls/errorPage.html');});

module.exports = app;