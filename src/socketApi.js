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
      socket.emit('INFO_DATA', { text });
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

  socket.on('ADD_NEW_FRIEND', (data) => {
    Account.find({_id: data.id, username: data.username}, (err, foundObject) => {
      const text = 'Bir şeyler ters gitti';
      if(!err, foundObject[0]){
        Account.find({secretID: data.add_friend_value}, (err, friendAccount) => {
          if(!err, friendAccount[0]){
            let finish = false;
            for(var i = 0; i < foundObject[0].friends.length; i++){
              if(foundObject[0].friends[i] == friendAccount[0].username){
                finish = true;
              }
            }
            if(!finish){
              foundObject[0].friends.push(friendAccount[0].username);
              socket.emit('CLEAR-PEOPLE-COLUMN');
              foundObject[0].save();
              for(var j = 0; j < foundObject[0].friends.length; j++){
                const friend = foundObject[0].friends[j];
                socket.emit('FRIEND_DATAS', { friend });
              }
              const text = 'Başarıyla eklendi';
              socket.emit('SOMETHING_WRONG_ADD_FRIEND', { text });
            }else{
              const text = 'Bu kişi zaten arkadaşınız'
              socket.emit('SOMETHING_WRONG_ADD_FRIEND', { text });
            }
          }else{
            socket.emit('SOMETHING_WRONG_ADD_FRIEND', { text });
          }
        });
      }else{
        socket.emit('SOMETHING_WRONG_ADD_FRIEND', { text });
      }
    });
  });

  socket.on('DELETE_FRIEND', (data) => {
    Account.find({_id: data.id, username: data.username}, (err, foundObject) => {
      let username;
      const text = 'Bir şeyler ters gitti';
      if(!err, foundObject[0]){
        let finish = false;
        Account.find({secretID: data.delete_friend_value}, (err, friendAccount) => {
          if(!err, friendAccount[0]){
            // Question: Friend location in friends array?
            if(friendAccount[0].secretID == data.delete_friend_value){
              username = friendAccount[0].username;
              for(var i = 0; i < foundObject[0].friends.length; i++){
                if(username == foundObject[0].friends[i]){
                  foundObject[0].friends.splice(i, 1);
                  finish = true;
                }
              }
              if(!finish){
                const text = 'BU ID ye sahip bir arkadaşınız yok';
                socket.emit('SOMETHING_WRONG_DELETE_FRIEND', { text });
              }else{
                const text = 'Başarıyla silindi';
                foundObject[0].save();
                socket.emit('SOMETHING_WRONG_DELETE_FRIEND', { text });
                socket.emit('CLEAR-PEOPLE-COLUMN');
                for(var i = 0; i < foundObject[0].friends.length; i++){
                  const friend = foundObject[0].friends[i];
                  socket.emit('FRIEND_DATAS', { friend });
                }
              }
            }else{
              socket.emit('SOMETHIN_WRONG_DELETE_FRIEND', { text });
            }
          }else{
            socket.emit('SOMETHIN_WRONG_DELETE_FRIEND', { text });
          }
        });
      }else{
        socket.emit('SOMETHIN_WRONG_DELETE_FRIEND', { text });
      }
    });
  });
});

module.exports = socketApi;