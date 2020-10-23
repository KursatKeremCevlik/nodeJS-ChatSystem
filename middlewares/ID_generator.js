const Accoounts = require('../models/Account');
const Admins = require('../models/Admins');
const Messages = require('../models/Messages');

module.exports = (prm, data, socket) => {
  if(prm == 'Admin'){
    let a = true;
    let ID;
    Admins.find((err, object) => {
      if(!err){
        while(a){
          let finish = 1;
          const secretID = Math.floor(Math.random() * 1000000);
          for(var i = 0; i < object.length; i++){
            const veri = object[i];
            if(veri.id == secretID){
              finish = 0;
            }
          }
          if(finish){
            ID = secretID;
            a = false
          }
        }
      }
      const adminData = new Admins({
        name: data.name,
        surname: data.surname,
        username: data.username,
        password: data.password,
        secretID: ID
      });
      adminData.save((err) => {
        if(!err){
        }
      });
    });
  }

  if(prm == 'Account'){
    let a = true;
    let ID;
    Accoounts.find((err, object) => {
      if(!err){
        while(a){
          let finish = 1;
          const secretID = Math.floor(Math.random() * 1000000);
          for(var i = 0; i < object.length; i++){
            const veri = object[i];
            if(veri.id == secretID){
              finish = 0;
            }
          }
          if(finish){
            ID = secretID;
            a = false
          }
        }
      }
      const accountData = new Accoounts({
        name: data.name,
        surname: data.surname,
        username: data.username,
        password: data.password,
        secretID: ID
      });
      accountData.save((err) => {
        if(!err){
          const text = 'Başarıyla kayıt olundu'
          const info = 1;
          socket.emit('INFO_DATA', { text, info });
        }
      });
    });
  }

  if(prm == 'Message'){
    // Save message
    let a = true;
    let ID;
    Messages.find((err, object) => {
      if(!err){
        while(a){
          let finish = 1;
          const secretID = Math.floor(Math.random() * 1000000);
          for(var i = 0; i < object.length; i++){
            const veri = object[i];
            if(veri.id == secretID){
              finish = 0;
            }
          }
          if(finish){
            ID = secretID;
            a = false
          }
        }
      }
      const messageData = new Messages({
        username: data.username,
        message: data.message,
        secretID: ID
      });
      messageData.save();
    });
  }
}

// console.log(ID);