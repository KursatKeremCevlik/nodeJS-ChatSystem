const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();

const username = 'Kerem01';
const password = '123';
const URL = 'mongodb+srv://ortakUser:12345@cluster0.vzpif.mongodb.net/chat';
// const URL = 'mongodb://localhost/ChatSystem'

const middlewareDB = require('./helper/middlewareDB')(username, password, URL);
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/sheets/htmls/homePage.html');
});
app.get('/LogIn', (req, res) => {
    res.sendFile(__dirname + '/sheets/htmls/LogIn.html');
});
app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/sheets/htmls/chat.html');
});

app.use('/css/homePage', express.static(path.join(__dirname, '/sheets/css/homePage.css')));
app.use('/js/LogIn', express.static(path.join(__dirname, '/sheets/js/LogIn.js')));
app.use('/css/LogIn', express.static(path.join(__dirname, '/sheets/css/LogIn.css')));
app.use('/js/chat', express.static(path.join(__dirname, '/sheets/js/chat.js')));
app.use('/css/chat', express.static(path.join(__dirname, '/sheets/css/chat.css')));
app.use('/js/adminPage', express.static(path.join(__dirname, '/sheets/js/adminPage.js')));
app.use('/css/adminPage', express.static(path.join(__dirname, '/sheets/css/adminPage.css')));



// Express Operations
const expressOprt = require('./operations/expressOprt')(app, express, logger, cookieParser, path);
app.use(function (req, res, next) {
    res.sendFile(__dirname + '/sheets/htmls/errorPage.html');
});
module.exports = app;