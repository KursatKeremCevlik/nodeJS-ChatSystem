const mongoose = require('mongoose');

// Admins
const ADMIN_1 = {
    username: '123',
    password: '123'
}
const ADMIN_2 = {
    username: '',
    password: ''
}

module.exports = (username, password) => {
    if(ADMIN_1.username == username && ADMIN_1.password == password){
        mongoDBConnectionFunction(mongoose);
    }else{
        console.log('MongoDB connection error: Username or Password is wrong');
    }
}

const mongoDBConnectionFunction = (mongoose) => {
    mongoose.connect('mongodb://localhost/ChatSystem', { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connection.on('open', () => {
        console.log('MongoDB: Connected');
    });
    mongoose.connection.on('error', (err) => {
        console.log('MongoDB: error', err);
    });
}