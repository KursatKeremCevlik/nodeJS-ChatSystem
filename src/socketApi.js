const socketio = require('socket.io');
const io = socketio();

// Models
const Account = require('../models/Account');

const socketApi = {  };
socketApi.io = io;

io.on('connection', (socket) => {
  socket.on('VARIABLES_LOGIN', (data) => {
    if(!data.name){
      socket.emit('WRONG_NAME_LOGIN');
    }else if(!data.surname){
      socket.emit('WRONG_SURNAME_LOGIN');
    }else if(!data.year){
      socket.emit('WRONG_YEAR_LOGIN');
    }else if(!data.username){
      socket.emit('WRONG_USERNAME_LOGIN');
    }else if(!data.password){
      socket.emit('WRONG_PASSWORD_LOGIN');
    }else{
      const account =  new Account({
        name: data.name,
        surname: data.surname,
        username: data.username,
        password: data.password,
        year: data.year
      });
      account.save();
      socket.emit('TRUE_VALUES_LOGIN');
    }
  });

  socket.on('VARIABLES_SIGNIN', (data) => {
    if(!data.username){
      socket.emit('WRONG_USERNAME_SIGNIN');
    }else if(!data.password){
      socket.emit('WRONG_PASSWORD_SIGNIN');
    }else{
      Account.find({ username: data.username, password: data.password }, (err, data) => {
        const veri = data[0];
        
        socket.emit('CLEAR_SIGNIN');
        socket.emit('CLEAR_SIGNIN-1');
        setTimeout(() => {
          socket.emit('CLEAR_SIGNIN-2');
        }, 500);
        setTimeout(() => {
          socket.emit('CLEAR_SIGNIN-3');
        }, 1000);
        setTimeout(() => {
          const name = veri.name;
          const surname = veri.surname;
          socket.emit('FIND_SIGNIN', { name, surname });
        }, 1500);
      });
    }
  });

  socket.on('MESSAGE_CHAT', (data) => {
    if(!data.message){
      socket.emit('EMPTY_MESSAGE_CHAT');
    }else{
      let message = data.message;
      io.emit('NEW_MESSAGE_CHAT', { message });
    }
  });
});

module.exports = socketApi;