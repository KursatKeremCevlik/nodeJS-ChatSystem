const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Messages = new Schema({
    name: String,
    toWho: String,
    message: String
});

module.exports = mongoose.model('Messages', Messages);