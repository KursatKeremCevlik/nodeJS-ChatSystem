const socketio = require('socket.io');
const io = socketio();

// Models
const Messages = require('../models/Messages');
const Account = require('../models/Account');

const socketApi = {  };
socketApi.io = io;

let OnlineCounts = [ ]

io.on('connection', (socket) => {
  let id;
  let YourName;
  let OnlineSurname;
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
        year: data.year,
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
          if(veri){
            const name = veri.name;
            const surname = veri.surname;
            socket.emit('FIND_SIGNIN', { name, surname });
            YourName = name;
          }else{
            socket.emit('WRONG_ACCOUNT_VALUES');
          }
        }, 1500);
      });
    }
  });

  socket.on('MESSAGE_CHAT', (data) => {
    if(!data.message){
      // Empty message
    }else{
      const defaultData = {
        message: data.message,
        type: 1
      }
      socket.broadcast.emit('NEW_MESSAGE_CHAT', defaultData);
      socket.emit('NEW_MESSAGE_FIRST_CHAT', { type: 0, message: data.message });
      const messageData = new Messages({
        name: YourName,
        message: data.message
      });
      messageData.save();
    }
  });

  socket.on('CHAT_ONLINE', (data) => {
    id = socket.id;
    OnlineName = data.my_name;
    OnlineCounts.push({id, OnlineName});
    console.log(OnlineCounts);
    io.emit('SOMEONE_ONLINE', OnlineCounts);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(OnlineCounts.length);
    if(!OnlineCounts.length == 1){
      for(var i=0; i < OnlineCounts.length; i++){
        let veri = OnlineCounts[i]
        if(veri.id == socket.id){
          delete OnlineCounts[i];
          console.log(OnlineCounts);
          io.emit('SOMEONE_ONLINE', OnlineCounts);
        }
      }
    }
  });
});

module.exports = socketApi;