const readline = require('readline');
const mongoose = require('mongoose');
const Accounts = require('./models/Account');
const Groups = require('./models/Groups');
const Messages = require('./models/Messages');

// const URL = 'mongodb+srv://ortakUser:12345@cluster0.vzpif.mongodb.net/chat';
let time;
const URL = 'mongodb://localhost/ChatSystem';
if(URL == 'mongodb://localhost/ChatSystem'){
  time = 100;
}else{
  time = 2000;
}
const middleWareDB = require('./helper/db');
middleWareDB(mongoose, URL, true); // True: connect DataBase

const successText = 'Operation success';
const unseccessText = 'Operation unsuccess';

const userInput = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
setTimeout(() => {
  console.log('1 :/ Delete account');
  console.log('2 :/ Delete message');
  console.log('3 :/ Delete group');
  userInput.question('What do you want?', (num) => {
    console.log('');
    let variable = '';
    let value = '';
    if(num == 1){
      variable = 'Account';
      userInput.question('Username? ', (username) => {
        value = username;
        Main('Account', value);
      });
    }else if(num == 2){
      variable == 'Message';
      userInput.question('SecretID? ', (secretID) => {
        value = Number(secretID);
        Main('Message', value);
      });
    }else if(num == 3){
      variable == 'Group';
      userInput.question('SecretID? ', (secretID) => {
        value = Number(secretID);
        Main('Group', value);
      });
    }
  });
}, time);
// const variable = '0'; // `Account`, `Message` or `Group`
// const value = '0' // Which document (Should secretID, but if you want delete account, value is should be username)

const Main = (variable, value) => {
  setTimeout(() => {
    if(variable == 'Account'){
      // Delete account and from other friend lists. (Should secretID)
      Accounts.find({username: value}, (err, object) => {
        if(!err && object[0]){
          for(var i = 0; i < object[0].friends.length; i++){
            // Delete from another account friend list
            Accounts.find({username: object[0].friends[i]}, (err, friendObject) => {
              if(!err && friendObject[0]){
                const friendList = friendObject[0].friends;
                for(var j = 0; j < friendList.length; j++){
                  if(friendList[j] == object[0].username){
                    friendList.splice(j, 1);
                  }
                }
                setTimeout(() => {friendObject[0].save();});
              }
            });
            // Delete from group user list
            Groups.find({name: object[0].friends[i]}, (err, groupObject) => {
              if(!err && groupObject[0]){
                for(var k = 0; k < groupObject.length; k++){
                  const groupUserList = groupObject[k].userList;
                  for(var l = 0; l < groupUserList.length; l++){
                    if(groupUserList[l].secretID == object[0].secretID){
                      // Delete this block
                      groupUserList.splice(l, 1);
                      groupObject[k].save();
                    }
                  }
                }
              }
            });
          }
          setTimeout(() => {
            Accounts.deleteOne({username: value}, (err, deleteObject) => {
              if(!err && deleteObject.deletedCount){
                console.log(`${successText}:`, deleteObject);
                process.exit(0);
              }else{
                console.log(`${unseccessText}:`, err);
                process.exit(0);
              }
            });
          });
        }else{
          console.log(`We don't have any account with this username '${value}'`);
          process.exit(0);
        }
      });
    }else if(variable == 'Message'){
      // Delete message. (Should secretID)
      Messages.deleteOne({secretID: value}, (err, deleteObject) => {
        if(!err && deleteObject.deletedCount){
          console.log(`${successText}:`, deleteObject);
          process.exit(0);
        }else{
          console.log(`${unseccessText}:`, err);
          process.exit(0);
        }
      });
    }else if(variable == 'Group'){
      // Delete group and from other friend lists. (Should secretID)
      Groups.find({secretID: value}, (err, object) => {
        if(!err && object[0]){
          // Find users in this group and delete from friend lists
          const userList = object[0].userList;
          for(var i = 0; i < userList.length; i++){
            Accounts.find({secretID: userList[i].secretID}, (err, accountObject) => {
              if(!err && accountObject[0]){
                const friends = accountObject[0].friends;
                for(var j = 0; j < friends.length; j++){
                  if(friends[j].secretID == value){
                    // Delete this friend from list
                    friends.splice(j, 1);
                    setTimeout(() => {accountObject[0].save();});
                  }
                }
              }
            });
          }
          setTimeout(() => {
            Messages.deleteMany({toWho: value}, (err, deleteMessageObject) => {
              if(!err){
                console.log(deleteMessageObject);
              }else{
                console.log(err);
              }
            });
            setTimeout(() => {
              Groups.deleteOne({secretID: value}, (err, deleteObject) => {
                if(!err && deleteObject.deletedCount){
                  console.log(`${successText}:`, deleteObject);
                  process.exit(0);
                }else{
                  console.log(`${unseccessText}:`, err);
                  process.exit(0);
                }
              });
            });
          });
        }else{
          console.log(`We don't have any group with this ID ${value}`);
          process.exit(0);
        }
      });
    }else if(variable == 'RestoreFriendList-V1'){
      Accounts.find({username: value}, (err, object) => {
        if(!err && object[0]){
          let friends = object[0].friends;
          const toAdded = [];
          for(var i = 0; i < friends.length; i++){
            Accounts.find({username: friends[i]}, (err, friendObject) => {
              if(!err && friendObject[0]){
                const friendName = friendObject[0].username;
                const friendID = friendObject[0].secretID;
                toAdded.push({name: friendName, secretID: friendID});
                friends = toAdded;
              }
            });
          }
          setTimeout(() => {
            object[0].friends = friends;
            object[0].save((err, updateObject) => {
              if(!err){
                console.log(`${successText}:`, updateObject)
                process.exit(0);
              }else{
                console.log(`${unseccessText}:`, err);
                process.exit(0);
              }
            });
          }, 2000);
        }else{
          console.log(`We don't have any account with this name ${value}`);
          process.exit(0);
        }
      });
    }
  });
}

// const arr = [0, 3, 2, 5];
// console.log(arr);
// arr.splice(1, 1);
// console.log(arr);
// arr.push(3);
// console.log(arr);
// moveArray(arr, arr.length-1, 1);
// console.log(arr);
// process.exit(0);

/* Schema (For delete account)
[
  {
    name,
    userList = [111111, 222222, 333333],   // ID
    ownerList = [111111],   // ID
    secretID
  },
  {
    name,
    userList = [111111, 222222, 333333],   // ID
    ownerList = [111111],   // ID
    secretID
  }
]
*/

/* Schema (For restore friend list)
Standart Account = {
  friends = [
    0: 'Kerem01',
    1: 'Example'
  ]
  ....
}
Modified Account = {
  friends = [
    0: {
      name: 'Kerem01',
      secretID: 111111
    },
    1: {
      name: 'Example',
      secretID: 111111
    }
  ]
}
....
*/