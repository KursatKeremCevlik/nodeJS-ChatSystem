const socketio = require('socket.io');
const io = socketio();
const socketApi = {};
socketApi.io = io;

const generator = require('../middlewares/ID_generator');
const Account = require('../models/Account');
const Groups = require('../models/Groups');
const Messages = require('../models/Messages');

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
    }else if(data.username.length > 15){
      const text = 'Karakter sayısı 15 den fazla olamaz';
      socket.emit('INFO_DATA', { text });
    }else{
      Account.find({username: data.username}, (err, object) => {
        if(!err && object[0]){
          const text = 'Bu kullanıcı adı kullanımda';
          socket.emit('INFO_DATA', { text });
        }else{
          if(!data.username == 'testAccount'){
            const text = 'Kayıt ediliyor';
            socket.emit('INFO_DATA', { text });
            const name = data.name;
            const surname = data.surname;
            const username = data.username;
            const password = data.password;
            const isOnline = false;
            generator('Account', {name, surname, username, password, isOnline}, socket);
          }else{
            const text = 'Bu kullanıcı adı kullanımda';
            socket.emit('INFO_DATA', { text });
          }
        }
      });
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
    update_friend_list(socket, data);
  });

  socket.on('ADD_NEW_FRIEND', (data) => {
    Account.find({_id: data.id, username: data.username}, (err, foundObject) => {
      const text = 'Bir şeyler ters gitti';
      if(!err, foundObject[0]){
        if(data.add_friend_value == foundObject[0].secretID){
          const text = 'Kendi kendinizi ekleyemezsiniz'
          socket.emit('SOMETHING_WRONG_ADD_FRIEND', { text });
        }else{
          Account.find({secretID: data.add_friend_value}, (err, friendAccount) => {
            if(!err, friendAccount[0]){
              let finish = false;
              for(var i = 0; i < foundObject[0].friends.length; i++){
                if(foundObject[0].friends[i] == friendAccount[0].username){
                  finish = true;
                }
              }
              if(!finish){
                friendAccount[0].friends.push({name: foundObject[0].username, secretID: foundObject[0].secretID});
                foundObject[0].friends.push({name: friendAccount[0].username, secretID: friendAccount[0].secretID});
                foundObject[0].save();
                friendAccount[0].save();
                const prm = data.add_friend_value;
                setTimeout(() => {
                  update_friend_list(socket, data, prm);
                }, 100);
                const text = 'Başarıyla eklendi';
                socket.emit('SOMETHING_WRONG_ADD_FRIEND', { text });
              }else{
                const text = 'Bu kişi zaten arkadaşınız'
                socket.emit('SOMETHING_WRONG_ADD_FRIEND', { text });
              }
            }else{
              const text = 'Böyle bir hesap yok'
              socket.emit('SOMETHING_WRONG_ADD_FRIEND', { text });
            }
          });
        }
      }else{
        socket.emit('SOMETHING_WRONG_ADD_FRIEND', { text });
      }
    });
  });

  socket.on('DELETE_FRIEND', (data) => {
    Account.find({_id: data.id, username: data.username}, (err, foundObject) => {
      const text = 'Bir şeyler ters gitti';
      if(!err, foundObject[0]){
        let finish = false;
        Account.find({secretID: data.delete_friend_value}, (err, friendAccount) => {
          if(!err, friendAccount[0]){
            // Question: Friend location in array?
            if(friendAccount[0].secretID == data.delete_friend_value){
              delete_username = friendAccount[0].username;
              for(var i = 0; i < foundObject[0].friends.length; i++){
                if(delete_username == foundObject[0].friends[i].name){
                  foundObject[0].friends.splice(i, 1);
                  finish = true;
                }
              }
              if(!finish){
                const text = 'Bu ID ye sahip bir arkadaşınız yok';
                socket.emit('SOMETHING_WRONG_DELETE_FRIEND', { text });
              }else{
                const text = 'Başarıyla silindi';
                foundObject[0].save();
                socket.emit('SOMETHING_WRONG_DELETE_FRIEND', { text });
                for(var i = 0; i < friendAccount[0].friends.length; i++){
                  if(friendAccount[0].friends[i].name == foundObject[0].username){
                    friendAccount[0].friends.splice(i, 1);
                  }
                }
                friendAccount[0].save();
                const prm = data.delete_friend_value;
                setTimeout(() => {
                  update_friend_list(socket, data, prm);
                }, 100);
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

  socket.on('PLEASE_FRIEND_DATAS', (data) => {
    Account.find({secretID: data.friendID}, (err, object) => {
      if(!err && object[0]){
        const friendName = object[0].username;
        const chatInfo = 'Friend';
        socket.emit('FRIEND_DATA', { friendName, chatInfo });
      }else{
        // Client open group screen
        Groups.find({secretID: data.friendID}, (err, object) => {
          if(!err && object[0]){
            const friendName = object[0].name;
            const chatInfo = 'Group';
            socket.emit('FRIEND_DATA', { friendName, chatInfo });
          }
        });
      }
    });
  });

  // Messages
  socket.on('NEW_MESSAGE', (data) => {
    if(data.message && data.friendID){
      Account.find({secretID: data.friendID}, (err, object) => {
        if(!err && object[0]){
          const message = data.message;
          const toWho = object[0].username;
          const fromWho = data.username;
          const info = 'Message';
          generator('Message', {message, toWho, fromWho}, socket, info);
        }
      });
    }
  });

  socket.on('PLEASE_MESSAGE_DATAS', (data) => {
    Messages.find((err, object) => {
      if(!err){
        socket.emit('CREATE_LOADING_EVENT');
        for(var i = 0; i < object.length; i++){
          if((object[i].fromWho==data.username && object[i].toWho==data.friendName)||(object[i].toWho==data.username&&object[i].fromWho==data.friendName)){
            const veri = object[i];
            socket.emit('ACCOUNT_MESSAGE_DATAS', veri);
          }
        }
        socket.emit('ACCOUNT_MESSAGES_DATAS_DONE');
      }
    });
  });

  socket.on('CREATE_NEW_GROUP', (data) => {
    if(!data.groupTitle){
      const info = 1;
      socket.emit('CREATE-GROUP-INFO', info);
    }else if(!data.groupContent){
      const info = 2;
      socket.emit('CREATE-GROUP-INFO', info);
    }else if(!data.addGroupPeopleArr[0]){
      const info = 3;
      socket.emit('CREATE-GROUP-INFO', info);
    }else{
      const prm = 'Group';
      const groupDatas = {
        groupTitle: data.groupTitle,
        groupContent: data.groupContent,
        addGroupPeopleArr: data.addGroupPeopleArr,
        ownerId: data.id,
        ownerName: data.username,
        username: data.username,
        id: data.id
      }
      generator(prm, groupDatas, socket);
    }
  });

  socket.on('NEW_MESSAGE_FOR_GROUP', (data) => {
    Account.find({username: data.username}, (err, object) => {
      if(!err && object[0]){
        Groups.find({secretID: data.friendID}, (err, foundObject) => {
          if(!err && foundObject[0]){
            // New message
            const messageData = {
              fromWho: object[0].username,
              toWho: foundObject[0].secretID,
              message: data.message
            }
            const info = 'MessageGroup';
            generator('Message', messageData, socket, info);
          }
        });
      }
    });
  });

  socket.on('PLEASE_MESSAGE_DATAS_FOR_GROUP', (data) => {
    Account.find({username: data.username, _id: data.id}, (err, object) => {
      if(!err && object[0]){
        socket.emit('CREATE_LOADING_EVENT');
        Messages.find({toWho: data.friendID}, (err, foundObject) => {
          if(!err){
            socket.emit('CLEAR-GROUP-CONTENT');
            for(var i = 0; i < foundObject.length; i++){
              const veri  = foundObject[i];
              Account.find({username: foundObject[i].fromWho}, (err, AccountObject) => {
                if(!err && AccountObject[0]){
                  Groups.find({secretID: data.friendID}, (err, GroupObject) => {
                    if(!err && GroupObject[0]){
                      const userList = GroupObject[0].userList
                      let finish = false;
                      let userColor;
                      setTimeout(() => {
                        for(var j = 0; j < userList.length; j++){
                          if(AccountObject[0].secretID == userList[j].secretID){
                            finish = true;
                            userColor = userList[j].color;
                          }
                        }
                        if(finish){
                          socket.emit('MESSAGE-DATAS-FOR-GROUP', {veri, userColor});
                        }
                      });
                    }
                  });
                }
              });
              // socket.emit('MESSAGE-DATAS-FOR-GROUP', { veri });
            }
          }
        });
      }
    });
  });
});

const update_friend_list = (socket, data, prm) => {
  // User account
  Account.find({_id: data.id, username: data.username}, (err, object) => {
    if(!err && object[0]){
      const usernameValue = data.username;
      socket.emit('CLEAR-PEOPLE-COLUMN', {usernameValue});
      for(var i = 0; i < object[0].friends.length; i++){
        let friendID;
        friendID = object[0].friends[i].secretID;
        Account.find({secretID: friendID}, (err, foundObject) => {
          if(!err && foundObject[0]){
            friendID = foundObject[0].secretID;
            const toWho = data.username;
            const friendName = foundObject[0].username;
            setTimeout(() => {
              const info = 'Friend';
              socket.emit('FRIEND_NAME_DATAS', { friendName, friendID, toWho, info });
            }, 10);
          }
        });
        Groups.find({secretID: friendID}, (err, foundObject) => {
          if(!err && foundObject[0]){
            friendID = foundObject[0].secretID;
            const toWho = data.username;
            const friendName = foundObject[0].name;
            setTimeout(() => {
              const info = 'Group';
              socket.emit('FRIEND_NAME_DATAS', { friendName, friendID, toWho, info });
            }, 10);
          }
        });
      }
    }
  });
  Account.find({secretID: prm}, (err, object) => {
    if(!err && object[0]){
      const usernameValue = object[0].username;
      socket.broadcast.emit('CLEAR-PEOPLE-COLUMN', {usernameValue});
      for(var i = 0; i < object[0].friends.length; i++){
        let friendID;
        friendID = object[0].friends[i].secretID;
        Account.find({secretID: friendID}, (err, foundObject) => {
          if(!err && foundObject[0]){
            const toWho = object[0].username;
            friendID = foundObject[0].secretID;
            const friendName = foundObject[0].username;
            setTimeout(() => {
              const info = 'Friend';
              socket.broadcast.emit('FRIEND_NAME_DATAS', { friendName, friendID, toWho, info });
            }, 10);
          }
        });
        Groups.find({secretID: friendID}, (err, foundObject) => {
          if(!err && foundObject[0]){
            const toWho = object[0].username;
            friendID = foundObject[0].secretID;
            const friendName = foundObject[0].name;
            setTimeout(() => {
              const info = 'Group';
              socket.broadcast.emit('FRIEND_NAME_DATAS', { friendName, friendID, toWho, info });
            }, 10);
          }
        });
      }
    }
  });
  return;
}

module.exports = socketApi;