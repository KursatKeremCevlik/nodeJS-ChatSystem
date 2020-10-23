const socketio = require('socket.io');
const io = socketio();
const socketApi = {};
socketApi.io = io;

const generator = require('../middlewares/ID_generator');

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
});

module.exports = socketApi;