const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Account = new Schema({
    name: String,
    surname: String,
    username: String,
    password: String,
    year: Number,
    friends: Array,
});

module.exports = mongoose.model('Account', Account);