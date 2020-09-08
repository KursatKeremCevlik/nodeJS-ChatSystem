// MongoDB user data
const username = 'Kerem01';
const password = '123';
// DataBase connection URL
const URL = 'mongodb+srv://ortakUser:12345@cluster0.vzpif.mongodb.net/chat';

/* Data base connection URL for localhost */
//    mongodb://localhost/ChatSystem


const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const app = express();

// DB Connection
const middlewareDB = require('./helper/middlewareDB')(username, password, URL);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Express Operations
const expressOprt = require('./operations/expressOprt')(app, express, logger, cookieParser, path);

// Route setting
app.use('/', indexRouter);

// Errors
const Errors = require('./operations/errors')(app, createError);

module.exports = app;