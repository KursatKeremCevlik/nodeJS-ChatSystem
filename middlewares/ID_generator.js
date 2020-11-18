const Accounts = require('../models/Account');
const Messages = require('../models/Messages');
const Groups = require('../models/Groups');
const generateColor = require('./randomColor');

module.exports = (prm, data, socket, info) => {
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
        secretID: ID,
        type: 'Account'
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
            if(!info == 'GroupMessage'){
              // Normal client message
              const messageData = {
                message: data.message,
                fromWho: data.fromWho,
                line: lineCounter,
                toWho: data.toWho,
                haveLink: false,
                secretID: ID
              }
              socket.emit('NEW_MESSAGE_DATA', messageData);
              socket.broadcast.emit('NEW_MESSAGE_DATA', messageData);
            }else{
              // Group message
              Accounts.find({username: data.fromWho}, (err, object) => {
                if(!err && object[0]){
                  Groups.find({secretID: data.toWho}, (err, groupObject) => {
                    if(!err && groupObject[0]){
                      const userList = groupObject[0].userList;
                      let userColor;
                      for(var i = 0; i < userList.length; i++){
                        if(userList[i].secretID == object[0].secretID){
                          userColor = userList[i].color;
                        }
                      }
                      const messageData = {
                        message: data.message,
                        fromWho: data.fromWho,
                        line: lineCounter,
                        toWho: data.toWho,
                        haveLink: false,
                        secretID: ID,
                        userColor: userColor
                      }
                      socket.emit('NEW-MESSAGE-FOR-GROUP', messageData);
                      socket.broadcast.emit('NEW-MESSAGE-FOR-GROUP', messageData);
                    }
                  });
                }
              });
            }
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
          link: URL,
          type: 'Message'
        });
        saveMessageData.save((err) => {
          if(!err){
            if(!info == 'GroupMessage'){
              // Normal client message
              socket.emit('NEW_MESSAGE_DATA', messageData);
              socket.broadcast.emit('NEW_MESSAGE_DATA', messageData);
            }else{
              // Group message
              Accounts.find({username: data.fromWho}, (err, object) => {
                if(!err && object[0]){
                  Groups.find({secretID: data.toWho}, (err, groupObject) => {
                    if(!err && groupObject[0]){
                      const userList = groupObject[0].userList;
                      let userColor;
                      for(var i = 0; i < userList.length; i++){
                        if(userList[i].secretID == object[0].secretID){
                          userColor = userList[i].color;
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
                        link: URL,
                        userColor: userColor
                      }
                      socket.emit('NEW-MESSAGE-FOR-GROUP', messageData);
                      socket.broadcast.emit('NEW-MESSAGE-FOR-GROUP', messageData);
                    }
                  });
                }
              });
            }
          }
        });
      }
    });
  }
  if(prm == 'Group'){
    Groups.find((err, object) => {
      if(!err){
        Accounts.find((err, foundObject) => {
          let a = true;
          let ID;
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
              for(var i = 0; i < foundObject.length; i++){
                const veri = foundObject[i];
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
          setTimeout(() => {
            /*
            arr = [
              {
                name: 'Kerem01',
                color: 'blue' // This color is random color,
              },
              {
                name: 'Example',
                color: 'red' // This color is random color
              }
            ]
            */
            const peopleArr = [];
            const colors = ['blue', 'lightblue', 'red', 'yellow', 'orange', 'black', 'purple', 'pink'];
            Accounts.find({username: data.ownerName}, (err, ownerObject) => {
              if(!err && ownerObject[0]){
                data.addGroupPeopleArr.push(ownerObject[0].secretID);
                setTimeout(() => {
                  for(var i = 0; i < data.addGroupPeopleArr.length; i++){
                    peopleArr.push({secretID: Number(data.addGroupPeopleArr[i]), color: generateColor(colors)});
                  }
                  const groupData = new Groups({
                    name: data.groupTitle,
                    userList: peopleArr,
                    ownerList: [data.ownerName],
                    secretID: ID,
                    type: 'Group'
                  });
                  // Add group to friendList and refresh client friendList (every account in this group)
                  groupData.save();
                  setTimeout(() => {
                    Accounts.find({username: data.ownerName}, (err, object) => {
                      // Push group name to accounts
                      if(!err, object[0]){
                        for(var i = 0; i < peopleArr.length; i++){
                          Accounts.find({secretID: peopleArr[i].secretID}, (err, foundObject) => {
                            if(!err, foundObject[0]){
                              foundObject[0].friends.push(data.groupTitle);
                              foundObject[0].save();
                              setTimeout(() => {
                                if(foundObject[0].secretID == object[0].secretID){
                                  update_my_list(object[0].secretID, ID, socket);
                                  setTimeout(() => {
                                    socket.emit('OPEN-NEW-GROUP-SCREEN');
                                  });
                                }else{
                                  update_another_people_list(foundObject[0].secretID, ID, socket);
                                }
                              });
                            }
                          });
                        }
                      }
                    });
                  }, 100);
                });
              }
            });
          });
        });
      }
    });
  }
}

const update_another_people_list = (secretID, ID, socket) => {
  Accounts.find({secretID: secretID}, (err, object) => {
    if(!err && object[0]){
      const usernameValue = object[0].username;
      const friendList = object[0].friends;
      socket.broadcast.emit('CLEAR-PEOPLE-COLUMN', {usernameValue});
      setTimeout(() => {
        for(var i = 0; i < friendList.length; i++){
          let friendID;
          const friendName = friendList[i];
          Accounts.find({username: friendList[i]}, (err, friendObject) => {
            if(!err && friendObject[0]){
              friendID = friendObject[0].secretID;
              const toWho = object[0].username;
              const info = 'Friend';
              setTimeout(() => {
                socket.broadcast.emit('FRIEND_NAME_DATAS', { friendName, friendID, toWho, info });
              });
            }else{
              Groups.find({secretID: ID}, (err, friendObject) => {
                if(!err && friendObject[0]){
                  friendID = friendObject[0].secretID;
                  const toWho = object[0].username;
                  const info = 'Group';
                  setTimeout(() => {
                    socket.broadcast.emit('FRIEND_NAME_DATAS', { friendName, friendID, toWho, info });
                  });
                }
              });
            }
          });
        }
      });
    }
  });
  return;
}

const update_my_list = (secretID, ID, socket) => {
  Accounts.find({secretID: secretID}, (err, object) => {
    if(!err && object[0]){
      const usernameValue = object[0].username;
      const friendList = object[0].friends;
      socket.emit('CLEAR-PEOPLE-COLUMN', {usernameValue});
      setTimeout(() => {
        for(var i = 0; i < friendList.length; i++){
          let friendID;
          const friendName = friendList[i];
          Accounts.find({username: friendList[i]}, (err, friendObject) => {
            if(!err && friendObject[0]){
              friendID = friendObject[0].secretID;
              const toWho = object[0].username;
              const info = 'Friend';
              setTimeout(() => {
                socket.emit('FRIEND_NAME_DATAS', { friendName, friendID, toWho, info });
              });
            }else{
              Groups.find({secretID: ID}, (err, friendObject) => {
                if(!err && friendObject[0]){
                  friendID = friendObject[0].secretID;
                  const toWho = object[0].username;
                  const info = 'Group';
                  setTimeout(() => {
                    socket.emit('FRIEND_NAME_DATAS', { friendName, friendID, toWho, info });
                  });
                }
              });
            }
          });
        }
      });
    }
  });
}