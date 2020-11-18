const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Groups = new Schema({
    name: String,
    userList: Array,
    ownerList: Array,
    secretID: Number
});

module.exports = mongoose.model('Groups', Groups);