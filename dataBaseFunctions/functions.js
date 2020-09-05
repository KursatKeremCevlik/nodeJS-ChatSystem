const Admin = require('../models/Admin');

module.exports = (PRM, socket, data, Account, Messages, YourName) => {
  // 1 -- Adding a new friends
  if(PRM == 'add_new_friend'){
    if(data){
      if(data.friendName){
        Account.findOne((err, foundObject) => {
          if(!err){
            foundObject.friends.push(data.friendName);
            foundObject.save((err, updateObject) => {
              if(!err){
                let message = 'Data has been saved successfully !';
                socket.emit('SUCCESS_SAVE', { message });
              }else{
                let message = 'Something wrong !';
                socket.emit('WRONG_SAVE', { message });
              }
            });
          }
        });
      }
    }
  }

  // 2 -- Adding a new account
  if(PRM == 'add_new_account'){
    if (!data.name) {
      socket.emit('WRONG_NAME_LOGIN');
    } else if (data.name.length > 12) {
      socket.emit('WRONG_NAMELENGTH_LOGIN', { text: 'İsminizin karakter sayısı 12 den küçük olmalıdır.' });
    } else if (!data.surname) {
      socket.emit('WRONG_SURNAME_LOGIN');
    } else if (!data.year) {
      socket.emit('WRONG_YEAR_LOGIN');
    } else if (!data.username) {
      socket.emit('WRONG_USERNAME_LOGIN');
    } else if (!data.password) {
      socket.emit('WRONG_PASSWORD_LOGIN');
    } else {
      const account = new Account({
        name: data.name,
        surname: data.surname,
        username: data.username,
        password: data.password,
        year: data.year,
      });
      account.save();
      socket.emit('TRUE_VALUES_LOGIN');
    }
  }

  // 3 -- Find messages from database
  if(PRM == 'find_message'){
    Messages.find({ published: true }, (err, data) => {
      const veri = data;
  
      if (veri) {
        for (var i = 0; i < veri.length; i++) {
          socket.emit('FROM_DATABASE', veri[i]);
        }
      }
    });
  }

  // 4 -- Save messages
  if(PRM == 'save_message'){
    const messageData = new Messages({
      name: YourName,
      message: data.message,
      published: true
    });
    messageData.save();
  }

  // 5 -- Find account and send account
  if(PRM == 'find_account'){
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
        if (veri) {
          const name = veri.name;
          const surname = veri.surname;
          socket.emit('FIND_SIGNIN', { name, surname });
          YourName = name;
        } else {
          socket.emit('WRONG_ACCOUNT_VALUES');
        }
      }, 1500);
    });
  }

  // 6 -- For admin page
  if(PRM == 'admin_page_data'){
    if(data.username){
      if(data.password){
        socket.emit('CLEAR_TEXT');
        socket.emit('CONTROL-1');
        setTimeout(() => {
          socket.emit('CLEAR_TEXT');
          socket.emit('CONTROL-2');
        }, 500);
        setTimeout(() => {
          socket.emit('CLEAR_TEXT');
          socket.emit('CONTROL-3');
        }, 1000);
        setTimeout(() => {
          if(data.username == 'Kerem01' && data.password == 'Kerem2005.'){
            // True admin data
            socket.emit('TRUE_ADMIN_DATA');
            Account.find((err, data) => {
              if(!err){
                socket.emit('ADMIN_DATAS', data);
              }
            });
          }else{
            // Wrong admin data
            socket.emit('CLEAR_TEXT');
            socket.emit('WRONG_ADMIN_DATA');
          }
        }, 1500);
      }else{
        socket.emit('CLEAR_TEXT');
        socket.emit('WRONG_PASSWORD_ADMIN');
      }
    }else{
      socket.emit('CLEAR_TEXT');
      socket.emit('WRONG_USERNAME_ADMIN');
    }
  }
}