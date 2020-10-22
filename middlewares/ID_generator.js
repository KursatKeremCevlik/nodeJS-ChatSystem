const Accoounts = require('../models/Account');
const Admins = require('../models/Admins');
const Messages = require('../models/Messages');

module.exports = (prm, data) => {
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
      adminData.save();
    });
  }
}

// console.log(ID);