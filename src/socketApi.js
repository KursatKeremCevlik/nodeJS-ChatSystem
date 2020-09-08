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
    // Adding a new account
    let PRM = 'add_new_account';
    functions(PRM, socket, data, Account);
  });

  socket.on('VARIABLES_SIGNIN', (data) => {
    if (!data.username) {
      socket.emit('WRONG_USERNAME_SIGNIN');
    } else if (!data.password) {
      socket.emit('WRONG_PASSWORD_SIGNIN');
    } else {
      // Find account and send
      let PRM = 'find_account';
      functions(PRM, socket, data, Account, Messages, YourName);
    }
  });

  socket.on('CONTINUE', () => {
    socket.emit('OK_CONTINUE');
  });

  socket.on('MESSAGE_CHAT', (data) => {
    if (!data.message) {
      // Empty message
    } else {
      // Send message
      let name = data.my_name;
      const defaultData = {
        name: data.my_name,
        message: data.message,
        type: 1
      }
      socket.broadcast.emit('NEW_MESSAGE_CHAT', defaultData);
      socket.emit('NEW_MESSAGE_FIRST_CHAT', { type: 0, message: data.message, name });

      // Save message
      let PRM = 'save_message';
      functions(PRM, socket, data, undefined, Messages);
    }
  });

  socket.on('CHAT_ONLINE', (data) => {
    if (data) {
      id = socket.id;
      OnlineName = data.my_name;
      OnlineCounts.push({ id, OnlineName });
      io.emit('SOMEONE_ONLINE', OnlineCounts);

      let PRM = 'find_message';
      functions(PRM, socket, data, Account, Messages);
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

  socket.on('IM_ADMIN', (data) => {
    let PRM = 'admin_page_data';
    functions(PRM, socket, data, Account);
  });

  socket.on('ADD_ADMIN', (data) => {
    // Add new admin
    let PRM = 'add_new_admin';
    functions(PRM, socket, data);
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