const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Messages = new Schema({
    username: String,
    message: String,
    secretID: Number
});

module.exports = mongoose.model('Messages', Messages);