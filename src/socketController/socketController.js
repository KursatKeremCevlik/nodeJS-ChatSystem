// Model
const Admin = require('../../models/Admin');

let finish = 0;

module.exports = (data) => {
  Admin.find((err, foundObject) => {
    if(!err){
      console.log(foundObject);
      for(var i = 0; i < foundObject.length; i++){
        let veri = foundObject[i];
        if(data.username == veri.username && data.password == veri.password){
          // True socket connection
          finish = 0;
        }else{
          finish = 1;
        }
      }
    }
  });
}