const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Messages = new Schema({
    fromWho: String,
    toWho: String,
    message: String,
    line: Number,
    secretID: Number
});

module.exports = mongoose.model('Messages', Messages);