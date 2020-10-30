const Accounts = require('../models/Account');

module.exports = (prm, data, socket) => {
  if(prm == 'Account'){
    let a = true;
    let ID;
    Accounts.find((err, object) => {
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
          if(secretID < 100000){
            finish = 0;
          }
          if(finish){
            ID = secretID;
            a = false
          }
        }
      }
      const accountData = new Accounts({
        name: data.name,
        surname: data.surname,
        username: data.username,
        password: data.password,
        isOnline: data.isOnline,
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
}