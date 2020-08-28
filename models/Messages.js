const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Messages = new Schema({
    name: String,
    message: String,
    published: Boolean
});

module.exports = mongoose.model('Messages', Messages);