const Account = require('../models/Account');
const { bulkWrite } = require('../models/Account');
const Accounts = require('../models/Account');
const Messages = require('../models/Messages');

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
  if(prm == 'Message'){
    let a = true;
    let ID;
    Messages.find((err, object) => {
      let lineCounter = 1;
      if(!err){
        while(a){
          let finish = 1;
          let counter = 0;
          const secretID = Math.floor(Math.random() * 1000000000);
          for(var i = 0; i < object.length; i++){
            const veri = object[i];
            if(veri.id == secretID){
              finish = 0;
            }
            if(counter){
              if(object[i-1].line < object[i].line){
                lineCounter = object[i].line + 1;
              }
            }
            if(object.length == 0){lineCounter = 1}
            if(object.length == 1){lineCounter = 2}
            counter++;
          }
          if(secretID < 100000000){
            finish = 0;
          }
          if(finish){
            ID = secretID;
            a = false
          }
        }
      }
      // const messageData = new Messages({
      //   fromWho: data.fromWho,
      //   toWho: data.toWho,
      //   message: data.message,
      //   line: lineCounter,
      //   secretID: ID
      // });
      // messageData.save((err) => {
      //   if(!err){
      //   }
      // });
      var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
      let isUrl = false;
      let URL;
      data.message.replace(urlRegex, (url) => {
        if(url){
          let linkOrder;
          const words = data.message.split(' ');
          for(var i = 0; i < words.length; i++){
            if(words[i] == url){
              linkOrder = i;
              isUrl = true;
              URL = url;
            }
          }
        }
      });
      if(!isUrl){
        const messageData = {
          message: data.message,
          fromWho: data.fromWho,
          line: lineCounter,
          toWho: data.toWho,
          haveLink: false,
          secretID: ID
        }
        const saveMessageData = new Messages({
          message: data.message,
          fromWho: data.fromWho,
          line: lineCounter,
          toWho: data.toWho,
          haveLink: false,
          secretID: ID
        });
        saveMessageData.save((err) => {
          if(!err){
            socket.emit('NEW_MESSAGE_DATA', messageData);
            socket.broadcast.emit('NEW_MESSAGE_DATA', messageData);
          }
        });
      }else{
        const words = data.message.split(' ');
        let beforeLink = [];
        let afterLink = [];
        let linkCounter = 0;
        for(var i = 0; i < words.length; i++){
          if(words[i] == URL){
            linkCounter++;
          }
          if(linkCounter){
            afterLink.push(words[i]);
          }else{
            beforeLink.push(words[i]);
          }
        }
        const messageData = {
          fromWho: data.fromWho,
          line: linkCounter,
          toWho: data.toWho,
          haveLink: true,
          secretID: ID,
          beforeLink: beforeLink,
          afterLink: afterLink,
          link: URL
        }
        const saveMessageData = new Messages({
          fromWho: data.fromWho,
          line: lineCounter,
          toWho: data.toWho,
          haveLink: true,
          secretID: ID,
          beforeLink: beforeLink,
          afterLink: afterLink,
          link: URL
        });
        saveMessageData.save((err) => {
          if(!err){
            socket.emit('NEW_MESSAGE_DATA', messageData);
            socket.broadcast.emit('NEW_MESSAGE_DATA', messageData);
          }
        });
      }
    });
  }
}