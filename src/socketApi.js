const socketio = require('socket.io');
const io = socketio();

// Models
const Messages = require('../models/Messages');
const Account = require('../models/Account');

// Helper functions
const functions = require('../dataBaseFunctions/functions');

const socketApi = {};
socketApi.io = io;

let OnlineCounts = []

io.on('connection', (socket) => {
  let id;
  let YourName;
  socket.on('VARIABLES_LOGIN', (data) => {
    let PRM = 'add_new_account';
    functions(PRM, socket, data, Account);
  });

  socket.on('VARIABLES_SIGNIN', (data) => {
    if (!data.username) {
      socket.emit('WRONG_USERNAME_SIGNIN');
    } else if (!data.password) {
      socket.emit('WRONG_PASSWORD_SIGNIN');
    } else {
      Account.find({ username: data.username, password: data.password }, (err, data) => {
        // Find account and send account
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
  });

  socket.on('CONTINUE', () => {
    socket.emit('OK_CONTINUE');
  });

  socket.on('MESSAGE_CHAT', (data) => {
    if (!data.message) {
      // Empty message
    } else {
      // Send message and save message
      let name = YourName;
      const defaultData = {
        name: data.my_name,
        message: data.message,
        type: 1
      }
      socket.broadcast.emit('NEW_MESSAGE_CHAT', defaultData);
      socket.emit('NEW_MESSAGE_FIRST_CHAT', { type: 0, message: data.message, name });
      const messageData = new Messages({
        name: YourName,
        message: data.message,
        published: true
      });
      messageData.save();
    }
  });

  socket.on('CHAT_ONLINE', (data) => {
    if (data) {
      id = socket.id;
      OnlineName = data.my_name;
      OnlineCounts.push({ id, OnlineName });
      io.emit('SOMEONE_ONLINE', OnlineCounts);

      // Find messages from database
      Messages.find({ published: true }, (err, data) => {
        const veri = data;

        if (veri) {
          for (var i = 0; i < veri.length; i++) {
            socket.emit('FROM_DATABASE', veri[i]);
          }
        }
      });
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    for (var i = 0; i < OnlineCounts.length; i++) {
      let veri = OnlineCounts[i]
      if (veri) {
        if (veri.id == socket.id) {
          // Delete online user
          delete OnlineCounts[i];
          io.emit('SOMEONE_ONLINE', OnlineCounts);
        }
      }
    }
  });

  socket.on('ADD_FRIEND', (data) => {
    let PRM = 'add_new_friend';
    functions(PRM, socket, data, Account);
  });

  // Argument ordering for Database operations
  /**
   * 1 -- PRM (PRM for the what is wanted)
   * 2 -- socket (Socket information for the connection method)
   * 3 -- data (Data for the program input)
   * 4 -- Account (Account for the program information)
   */
});

module.exports = socketApi;