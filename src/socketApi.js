const socketio = require('socket.io');
const io = socketio();
const socketApi = {};
socketApi.io = io;

const generator = require('../middlewares/ID_generator');
const Account = require('../models/Account');

io.on('connection', (socket) => {
  socket.on('SIGNUP_DATAS', (data) => {
    if(!data.name){
      const text = 'İsim girmediniz'
      socket.emit('INFO_DATA', { text });
    }else if(!data.surname){
      const text = 'Soyisim girmediniz'
      socket.emit('INFO_DATA', { text });
    }else if(!data.username){
      const text = 'Kullanıcı adı girmediniz'
      socket.emit('INFO_DATA', { text });
    }else if(!data.password){
      const text = 'Şifre girmediniz'
      socket.emit('INFO_DATA', { text });
    }else{
      const text = 'Kayıt ediliyor'
      socket.emit('INFI_DATA', { text });
      const name = data.name;
      const surname = data.surname;
      const username = data.username;
      const password = data.password;
      generator('Account', {name, surname, username, password}, socket);
    }
  });

  socket.on('LOGIN_DATAS', (data) => {
    if(!data.username){
      const text = 'Kullanıcı adı girmediniz'
      socket.emit('LOGIN_INFO_TEXT', { text });
    }else if(!data.password){
      const text = 'Şifre girmediniz'
      socket.emit('LOGIN_INFO_TEXT', { text });
    }else{
      Account.find({username: data.username, password: data.password}, (err, object) => {
        if(!err && object[0]){
          const text = 'Yönlendiriliyorsunuz'
          const permission = 1;
          const id = object[0]._id;
          socket.emit('LOGIN_INFO_TEXT', { text, permission, id });
        }else{
          const text = 'Kullanıcı adı veya şifreniz yanlış'
          const permission = 2;
          socket.emit('LOGIN_INFO_TEXT', { text, permission });
        }
      });
    }
  });

  socket.on('PERMISSION_ACCOUNT', (data) => {
    Account.find({_id: data.id, username: data.username}, (err, object) => {
      if(!err, object[0]){
        const id = object[0].secretID
        socket.emit('TRUE_ACCOUNT', {id});
      }else{
        socket.emit('WRONG_ACCOUNT');
      }
    });
  });

  socket.on('PLEASE_PROFILE_DATAS', (data) => {
    Account.find({_id: data.id}, (err, object) => {
      if(!err && object[0]){
        for(var i = 0; i < object[0].friends.length; i++){
          const friend = object[0].friends[i];
          socket.emit('FRIEND_DATAS', { friend });
        }
      }
    });
  });
});

module.exports = socketApi;