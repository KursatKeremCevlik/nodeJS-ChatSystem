const mongoose = require('mongoose');
const mongoDBConnectionFunction = require('./db');

module.exports = (username, password) => {
    for(var i = 0; i < ADMINS.length; i++){
        let veri = ADMINS[i];
        if(veri.username == username && veri.password == password){
            // DB connection on
            mongoDBConnectionFunction(mongoose);
        }
        else if(i == ADMINS.length - 1){
            console.log('MongoDB Connection error: Username or password wrong');
        }
    }
}

const ADMINS = [
    admin1 = {
        username: 'Kerem01',
        password: '123'
    }
]