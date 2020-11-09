const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Messages = new Schema({
    fromWho: String,
    toWho: String,
    message: String,
    line: Number,
    haveLink: Boolean,
    secretID: Number,
    beforeLink: Array,
    afterLink: Array,
    link: String
});

module.exports = mongoose.model('Messages', Messages);