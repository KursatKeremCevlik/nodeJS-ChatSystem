$(() => {
  const socket = io.connect('https://example-chat-system.herokuapp.com/');
  // const socket = io.connect('http://localhost:3000');
  
  const id = localStorage.getItem('kursatkerem-chat-system-account-id');
  const username = localStorage.getItem('kursatkerem-chat-system-username');
  
  socket.emit('PERMISSION_ACCOUNT', { id, username });
  socket.on('TRUE_ACCOUNT', (data) => {open_chat_screen(data);});
  socket.on('WRONG_ACCOUNT', () => {close_chat_screen();});
  
  const open_chat_screen = (data) => {
    $('.waiting_room').hide();
    $('.wrong_account').hide();
    $('.chat_screen').show();
    $('.profile-id').html(`Your id: ${data.id}`);
  }
  const close_chat_screen = () => {
    $('.waiting_room').hide();
    $('.chat_screen').hide();
    $('.wrong_account').show();
    return false;
  }

  let friends;
  let settingCounter = false;
  $('.btn').on('click', () => {
    if(!settingCounter){$('.dropdown-content').show();settingCounter = true;}
    else{$('.dropdown-content').hide();settingCounter = false;}
  });
  window.addEventListener('click', e => {
    if(settingCounter){
      if(e.target.className.indexOf('fa fa-bars') === -1){
        $('.dropdown-content').hide();
        settingCounter = false;
      }
    }
    if(e.target.className.indexOf('from-who-text') === -1){
      $('.people-dropdown-content').hide();
    }
  });

  $('.create-group-buton').on('click', () => {open_create_group_column();});

  const open_create_group_column = () => {
    const createGroupColumn = document.getElementById('create-group-column-first');
    const firstColumn = document.getElementById('firstColumn');
    firstColumn.className = 'firstColumn setting-animation-blackout';
    setTimeout(() => {
      $('.firstColumn').hide();
    }, 480);
    setTimeout(() => {
      createGroupColumn.className = 'create-group-column setting-animation-lighting';
    }, 510);
    setTimeout(() => {
      $('.create-group-column').show();
    }, 990);
    $('.goBack').on('click', () => {
      createGroupColumn.className = 'create-group-column setting-animation-blackout';
      setTimeout(() => {$('.create-group-column').hide();}, 480);
      setTimeout(() => {
        firstColumn.className = 'firstColumn setting-animation-lighting';
      }, 510);
      setTimeout(() => {
        $('.firstColumn').show();
      }, 990);
    });
  }
  const open_add_friend_column = () => {
    if(counter == 'empty'){
      peopleColumn.className = 'people-column people-column-animation-up';
      add_friend_home.className = 'add_friend_home setting add-friend-animation';
      peopleColumn.style.height = '270px';
      $('.setting').hide();
      $('.close_buton_home').show();
      setTimeout(() => {
        $('.add_friend_home').show();
        add_friend_home.className = 'add_friend_home setting setting-animation-up';
      }, 490);
      counter = 'add-friend-now';
    }
    if(counter == 'delete-friend-now'){
      delete_friend_home.className = 'delete_friend_home setting setting-animation-blackout';
      setTimeout(() => {
        $('.delete_friend_home').hide();
        add_friend_home.className = 'add_friend_home setting setting-animation-lighting';
        $('.add_friend_home').show();
      }, 490);
      counter = 'add-friend-now';
    }
  }
  const open_delete_friend_column = () => {
    if(counter == 'empty'){
      peopleColumn.className = 'people-column people-column-animation-up';
      peopleColumn.style.height = '270px';
      counter = 'delete-friend-now';
      $('.setting').hide();
      $('.close_buton_home').show();
      setTimeout(() => {
        $('.delete_friend_home').show();
        delete_friend_home.className = 'delete_friend_home setting setting-animation-up'
      }, 490);
    }
    if(counter == 'add-friend-now'){
      add_friend_home.className = 'add_friend_home setting setting-animation-blackout';
      counter = 'delete-friend-now';
      setTimeout(() => {
        $('.add_friend_home').hide();
        delete_friend_home.className = 'delete_friend_home setting setting-animation-lighting';
        $('.delete_friend_home').show();
      }, 490);
    }
  }

  $('.add-friend-buton').on('click', () => {open_add_friend_column();});
  $('.delete-friend-buton').on('click', () => {open_delete_friend_column();});

  const add_friend_home = document.getElementById('add_friend_home');
  const delete_friend_home = document.getElementById('delete_friend_home');
  const peopleColumn = document.getElementById('people-column');
  const person = document.createElement('div');
  let friendsArr = [];
  
  socket.emit('PLEASE_PROFILE_DATAS', { id, username });
  let addGroupPeopleArr = [];
  let friendID;
  const groupTitleInput = document.getElementById('group-title-input');
  const groupContentInput = document.getElementById('group-subject-input');
  const groupUsersInput = document.getElementById('group-add-people-input');
  socket.on('CLEAR-PEOPLE-COLUMN', (data) => {
    if(data.usernameValue == username){
      friendsArr = [];
      friends = [];
      $('.person').html('');
      $('.userList').html('');
    }
  });
  socket.on('FRIEND_NAME_DATAS', (data) => {
    if(data.toWho == username){
      friendsArr.push(data);
      if(data.info == 'Friend' || data.info == 'Group'){
        person.className = 'person';
        const people_hr = document.createElement('div');
        people_hr.className = 'people_hr';
        person.appendChild(people_hr);
        const people = document.createElement('div');
        people.className = `people ${data.friendID}`;
        people.id = 'people';
        person.appendChild(people);
        const people_name = document.createElement('div');
        people_name.className = 'people_name';
        const node = document.createTextNode(`${data.friendName}`);
        people_name.appendChild(node);
        people.appendChild(people_name);
        person.appendChild(people_hr);

        people.onclick = () => {
          if(friendID==people.classList[1]){
          }else{
            $('.page').hide();
            $('.clientPage').show();
            $('.clientPage').html('');
            friendID = people.classList[1];
            socket.emit('PLEASE_FRIEND_DATAS', { friendID });
          }
        }
      }
      if(data.info == 'Friend'){
        const userList = document.getElementById('userList');
        const user = document.createElement('div');
        user.className = `user ${data.friendID}`;
        const userName = document.createElement('div');
        userName.className = 'user-name';
        userName.id = `${data.friendID}`;
        const userNameText = document.createTextNode(`${data.friendName}`);
        userName.appendChild(userNameText);
        const people_HR = document.createElement('div');
        people_HR.className = 'people_hr';
        user.appendChild(userName);
        user.appendChild(people_HR);
        userList.appendChild(user);

        user.onclick = () => {
          const userID = document.getElementById(userName.id);
          if(addGroupPeopleArr[0]){
            let finish = false;
            for(var i = 0; i < addGroupPeopleArr.length; i++){
              if(userID.id == addGroupPeopleArr[i]){finish = true;}
            }
            if(!finish){
              user.style.backgroundColor = 'rgb(89, 89, 202)';
              addGroupPeopleArr.push(userID.id);
            }else{
              user.style.backgroundColor = 'green'
              for(var i = 0; i < addGroupPeopleArr.length; i++){
                if(userID.id == addGroupPeopleArr[i]){addGroupPeopleArr.splice(i, 1);}
              }
            }
          }else{
            user.style.backgroundColor = 'rgb(89, 89, 202)';
            addGroupPeopleArr.push(userID.id);
          }
        }
      }

      socket.on('CREATE-GROUP-INFO', (info) => {
        // Empty group title
        if(info == 1){groupTitleInput.style.border = '1px solid red';}
        // Empty group content
        if(info == 2){groupContentInput.style.border = '1px solid red';}
        // Empty group users
        if(info == 3){groupUsersInput.style.borderBottom = '1px solid red';}
      });
    }
  });
  peopleColumn.appendChild(person);
  
  $('.permiss-create-group-buton').on('click', () => {
    groupTitleInput.style.border = '1px solid white';
    groupContentInput.style.border = '1px solid white';
    groupUsersInput.style.borderBottom = '1px solid grey';
    const groupTitle = groupTitleInput.value;
    const groupContent = groupContentInput.value;
    socket.emit('CREATE_NEW_GROUP', {groupTitle, groupContent, addGroupPeopleArr, id, username});
  });
  

  /* CHAT SCRIPTS */
  let friendName;
  socket.on('FRIEND_DATA', (data) => {
    friends.push(data);
    const clientPage = document.getElementById('clientPage');
    const topUserInformation = document.createElement('div');
    topUserInformation.className = 'top-user-information';
    const topUserInformationName = document.createTextNode(data.friendName);
    topUserInformation.appendChild(topUserInformationName);
    const privateChatHR = document.createElement('div');
    privateChatHR.className = 'private-chat-HR';
    const messagesContainer = document.createElement('div');
    messagesContainer.className = 'messages-container';
    messagesContainer.id = 'messages-container';
    const privateChatHRDown = document.createElement('div');
    privateChatHRDown.className = 'private-chat-HR-down';
    const messageFormContainer = document.createElement('div');
    messageFormContainer.className = 'message-form-container';
    const messageFormHome = document.createElement('div');
    messageFormHome.className = 'message-form-home';
    const messageForm = document.createElement('form');
    messageForm.className = 'message-form';
    const messageInput = document.createElement('input');
    messageInput.type = 'text';
    messageInput.autocomplete = 'off';
    messageInput.autofocus = 'true';
    messageInput.className = 'input-element message-input';
    messageInput.id = 'message-input';
    const messageInputButon = document.createElement('input');
    messageInputButon.type = 'submit';
    messageInputButon.className = 'input-element message-input-buton';
    messageInputButon.id = 'message-input-buton';

    messageForm.appendChild(messageInput);
    messageForm.appendChild(messageInputButon);
    messageFormHome.appendChild(messageForm);
    messageFormContainer.appendChild(messageFormHome);
    clientPage.appendChild(topUserInformation);
    clientPage.appendChild(privateChatHR);
    clientPage.appendChild(messagesContainer);
    clientPage.appendChild(privateChatHRDown);
    clientPage.appendChild(messageFormContainer);
    messageForm.addEventListener('submit', e => {
      e.preventDefault();
      if(data.chatInfo == 'Friend'){
        // Chat with friend
        if(messageInput.value){
          const message = messageInput.value;
          socket.emit('NEW_MESSAGE', {message, username, friendID});
          messageInput.value = '';
        }
      }else if(data.chatInfo == 'Group'){
        // Chat with group
        if(messageInput.value){
          const message = messageInput.value;
          socket.emit('NEW_MESSAGE_FOR_GROUP', {message, username, friendID});
          messageInput.value = '';
        }
      }
    });
    friendName = data.friendName;
    if(data.chatInfo == 'Group'){
      socket.emit('PLEASE_MESSAGE_DATAS_FOR_GROUP', {username, id, friendID});
    }else{
      socket.emit('PLEASE_MESSAGE_DATAS', {username, friendName});
    }
  });

  socket.on('OPEN-NEW-GROUP-SCREEN', () => {
    const createGroupColumn = document.getElementById('create-group-column-first');
    const firstColumn = document.getElementById('firstColumn');
    createGroupColumn.className = 'create-group-column setting-animation-blackout';
    setTimeout(() => {$('.create-group-column').hide();}, 480);
    setTimeout(() => {
      firstColumn.className = 'firstColumn setting-animation-lighting';
    }, 510);
    setTimeout(() => {
      $('.firstColumn').show();
    }, 990);
  });
  
  let messages = [];
  // Loading animation
  socket.on('CREATE_LOADING_EVENT', () => {
    messages = [];
    const element = document.getElementById('messages-container');
    element.className = 'messages-container messages-container-align';
    $('.messages-container').html('Yükleniyor');
  });
  //

  // Group message scripts
  socket.on('CLEAR-GROUP-CONTENT', () => {
    setTimeout(() => {
      const element = document.getElementById('messages-container');
      $('.messages-container').html('');
      element.className = 'messages-container';
    }, 500);
  });

  socket.on('NEW-MESSAGE-FOR-GROUP', (data) => {
    let finish = false;
    for(var i = 0; i < friendsArr.length; i++){
      console.log(friendsArr[i].friendID, data.toWho);
      if(friendsArr[i].friendID == data.toWho){
        finish = true;
      }
    }
    if(finish){createMessageForGroup(data);}
  });
  socket.on('MESSAGE-DATAS-FOR-GROUP', (data) => {
    let finish = false;
    for(var i = 0; i < friendsArr.length; i++){
      if(friendsArr[i].friendID == data.veri.toWho){
        finish = true;
      }
    }
    if(finish){
      const veri = {
        afterLink: data.veri.afterLink,
        beforeLink: data.veri.beforeLink,
        fromWho: data.veri.fromWho,
        haveLink: data.veri.haveLink,
        line: data.veri.line,
        message: data.veri.message,
        link: data.veri.link,
        secretID: data.veri.secretID,
        toWho: data.veri.toWho,
        userColor: data.userColor,
      }
      setTimeout(() => {createMessageForGroup(veri);}, 500);
    }
  });
  const createMessageForGroup = (data) => {
    const MessagesContainer = document.getElementById('messages-container');
    if(data.haveLink){
      // This message with link
      if(data.fromWho == username){
        // My message with link
        const messageContainer = document.createElement('div');
        messageContainer.className = 'message-container-group';
        const messageHome = document.createElement('div');
        messageHome.className = 'message-home my-message-home';
        const message = document.createElement('div');
        message.className = 'message my-message';
        const fromWhoHome = document.createElement('div');
        fromWhoHome.className = 'from-who-home';
        const fromWho = document.createElement('a');
        fromWho.className = `from-who from-me ${data.userColor}`;
        const fromWhoTextHome = document.createElement('b');
        fromWhoTextHome.className = 'from-who-text';
        const fromWhoText = document.createTextNode(`${data.fromWho}`);
        fromWhoTextHome.appendChild(fromWhoText);
        fromWho.appendChild(fromWhoTextHome);
        fromWhoHome.appendChild(fromWho);
        // const peopleDropDownContent = document.createElement('div');
        // peopleDropDownContent.className = `people-dropdown-content my-dropdown-content`;
        // peopleDropDownContent.id = `${data.secretID}`;
        let createElementCounter = false;
        for(var i = 0; i < friendsArr.length; i++){
          if(friendsArr[i].friendName == data.fromWho){
            createElementCounter = true;
          }
        }
        setTimeout(() => {
          // if(createElementCounter){
          //   // Dropdown content is ``Send message``
          //   const sendMessageHome = document.createElement('a');
          //   sendMessageHome.className = `send-message ${data.fromWho}`;
          //   const sendMessageText = document.createTextNode('Mesaj at');
          //   sendMessageHome.appendChild(sendMessageText);
          //   peopleDropDownContent.appendChild(sendMessageHome);
          // }else{
          //   // Dropdown content is ``Add friend``
          //   const addFriendHome = document.createElement('a');
          //   addFriendHome.className = `add-friend ${data.fromWho}`;
          //   const addFriendText = document.createTextNode('Kişi ekle');
          //   addFriendHome.appendChild(addFriendText);
          //   peopleDropDownContent.appendChild(addFriendHome);
          // }
          setTimeout(() => {
            // fromWhoHome.appendChild(peopleDropDownContent);
            message.appendChild(fromWhoHome);
            const myMessage = document.createElement('div');
            myMessage.className = `my-message ${data.secretID}`;
            fromWho.onclick = () => {fromWhoClick(data.secretID);}
            message.appendChild(myMessage);
            messageHome.appendChild(message);
            messageContainer.appendChild(messageHome);
            MessagesContainer.appendChild(messageContainer);
            messageWithLink(data);
          });
        });
      }else{
        // Another message with link
        const messageContainer = document.createElement('div');
        messageContainer.className = 'message-container-group';
        const messageHome = document.createElement('div');
        messageHome.className = 'message-home another-message-home';
        const message = document.createElement('div');
        message.className = 'message another-message';
        const fromWhoHome = document.createElement('div');
        fromWhoHome.className = 'from-who-home';
        const fromWho = document.createElement('a');
        fromWho.className = `from-who from-another ${data.userColor}`;
        const fromWhoTextHome = document.createElement('b');
        fromWhoTextHome.className = 'from-who-text';
        const fromWhoText = document.createTextNode(`${data.fromWho}`);
        fromWhoTextHome.appendChild(fromWhoText);
        fromWho.appendChild(fromWhoTextHome);
        fromWhoHome.appendChild(fromWho);
        const peopleDropDownContent = document.createElement('div');
        peopleDropDownContent.className = `people-dropdown-content another-people-dropdown-content`;
        peopleDropDownContent.id = `${data.secretID}`;
        let createElementCounter = false;
        for(var i = 0; i < friendsArr.length; i++){
          if(friendsArr[i].friendName == data.fromWho){
            createElementCounter = true;
          }
        }
        setTimeout(() => {
          if(createElementCounter){
            // Dropdown content is ``Send message``
            const sendMessageHome = document.createElement('a');
            sendMessageHome.className = `send-message ${data.fromWho}`;
            const sendMessageText = document.createTextNode('New message');
            sendMessageHome.appendChild(sendMessageText);
            peopleDropDownContent.appendChild(sendMessageHome);
          }else{
            // Dropdown content is ``Add friend``
            const addFriendHome = document.createElement('a');
            addFriendHome.className = `add-friend ${data.fromWho}`;
            const addFriendText = document.createTextNode('Add friend');
            addFriendHome.appendChild(addFriendText);
            peopleDropDownContent.appendChild(addFriendHome);
          }
          setTimeout(() => {
            fromWhoHome.appendChild(peopleDropDownContent);
            message.appendChild(fromWhoHome);
            const myMessage = document.createElement('div');
            myMessage.className = `another-message ${data.secretID}`;
            fromWho.onclick = () => {fromWhoClick(data.secretID);}
            message.appendChild(myMessage);
            messageHome.appendChild(message);
            messageContainer.appendChild(messageHome);
            MessagesContainer.appendChild(messageContainer);
            messageWithLink(data);
          });
        });
      }
    }else{
      if(data.fromWho == username){
        // My message for group
        const messageContainer = document.createElement('div');
        messageContainer.className = 'message-container-group';
        const messageHome = document.createElement('div');
        messageHome.className = 'message-home my-message-home';
        const message = document.createElement('div');
        message.className = 'message my-message';
        const fromWhoHome = document.createElement('div');
        fromWhoHome.className = 'from-who-home';
        const fromWho = document.createElement('a');
        fromWho.className = `from-who from-me ${data.userColor}`;
        const fromWhoTextHome = document.createElement('b');
        fromWhoTextHome.className = 'from-who-text';
        const fromWhoText = document.createTextNode(`${data.fromWho}`);
        fromWhoTextHome.appendChild(fromWhoText);
        fromWho.appendChild(fromWhoTextHome);
        fromWhoHome.appendChild(fromWho);
        // const peopleDropDownContent = document.createElement('div');
        // peopleDropDownContent.className = `people-dropdown-content my-dropdown-content`;
        // peopleDropDownContent.id = `${data.secretID}`;
        let createElementCounter = false;
        for(var i = 0; i < friendsArr.length; i++){
          if(friendsArr[i].friendName == data.fromWho){
            createElementCounter = true;
          }
        }
        setTimeout(() => {
          // if(createElementCounter){
          //   // Dropdown content is ``Send message``
          //   const sendMessageHome = document.createElement('a');
          //   sendMessageHome.className = `send-message ${data.fromWho}`;
          //   const sendMessageText = document.createTextNode('Mesaj at');
          //   sendMessageHome.appendChild(sendMessageText);
          //   peopleDropDownContent.appendChild(sendMessageHome);
          // }else{
          //   // Dropdown content is ``Add friend``
          //   const addFriendHome = document.createElement('a');
          //   addFriendHome.className = `add-friend ${data.fromWho}`;
          //   const addFriendText = document.createTextNode('Kişi ekle');
          //   addFriendHome.appendChild(addFriendText);
          //   peopleDropDownContent.appendChild(addFriendHome);
          // }
          setTimeout(() => {
            // fromWhoHome.appendChild(peopleDropDownContent);
            message.appendChild(fromWhoHome);
            const myMessage = document.createElement('div');
            myMessage.className = `my-message ${data.secretID}`;
            fromWho.onclick = () => {fromWhoClick(data.secretID);}
            const myMessageText = document.createTextNode(`${data.message}`);
            myMessage.appendChild(myMessageText);
            message.appendChild(myMessage);
            messageHome.appendChild(message);
            messageContainer.appendChild(messageHome);
            MessagesContainer.appendChild(messageContainer);
          });
        });
      }else{
        // Another people message for group
        const messageContainer = document.createElement('div');
        messageContainer.className = 'message-container-group';
        const messageHome = document.createElement('div');
        messageHome.className = 'message-home another-message-home';
        const message = document.createElement('div');
        message.className = 'message another-message';
        const fromWhoHome = document.createElement('div');
        fromWhoHome.className = 'from-who-home';
        const fromWho = document.createElement('a');
        fromWho.className = `from-who from-another ${data.userColor}`;
        const fromWhoTextHome = document.createElement('b');
        fromWhoTextHome.className = 'from-who-text';
        const fromWhoText = document.createTextNode(`${data.fromWho}`);
        fromWhoTextHome.appendChild(fromWhoText);
        fromWho.appendChild(fromWhoTextHome);
        fromWhoHome.appendChild(fromWho);
        const peopleDropDownContent = document.createElement('div');
        peopleDropDownContent.className = `people-dropdown-content another-people-dropdown-content`;
        peopleDropDownContent.id = `${data.secretID}`;
        let createElementCounter = false;
        for(var i = 0; i < friendsArr.length; i++){
          if(friendsArr[i].friendName == data.fromWho){
            createElementCounter = true;
          }
        }
        setTimeout(() => {
          if(createElementCounter){
            // Dropdown content is ``Send message``
            const sendMessageHome = document.createElement('a');
            sendMessageHome.className = `send-message ${data.fromWho}`;
            const sendMessageText = document.createTextNode('New message');
            sendMessageHome.appendChild(sendMessageText);
            peopleDropDownContent.appendChild(sendMessageHome);
          }else{
            // Dropdown content is ``Add friend``
            const addFriendHome = document.createElement('a');
            addFriendHome.className = `add-friend ${data.fromWho}`;
            const addFriendText = document.createTextNode('Add friend');
            addFriendHome.appendChild(addFriendText);
            peopleDropDownContent.appendChild(addFriendHome);
          }
          setTimeout(() => {
            fromWhoHome.appendChild(peopleDropDownContent);
            message.appendChild(fromWhoHome);
            const myMessage = document.createElement('div');
            myMessage.className = `another-message ${data.secretID}`;
            fromWho.onclick = () => {fromWhoClick(data.secretID);}
            const myMessageText = document.createTextNode(`${data.message}`);
            myMessage.appendChild(myMessageText);
            message.appendChild(myMessage);
            messageHome.appendChild(message);
            messageContainer.appendChild(messageHome);
            MessagesContainer.appendChild(messageContainer);
          });
        });
      }
    }
    setTimeout(() => {
      const element = document.getElementById('messages-container');
      element.scrollTop = element.scrollHeight;
    }, 10);
  }

  const fromWhoClick = (secretID) => {
    $('.people-dropdown-content').hide();
    $(`#${secretID}`).show();
  }
  //
  
  socket.on('ACCOUNT_MESSAGE_DATAS', (data) => {messages.push(data);});
  socket.on('ACCOUNT_MESSAGES_DATAS_DONE', () => {
    setTimeout(() => {
      const element = document.getElementById('messages-container');
      element.className = 'messages-container';
      $('.messages-container').html('');
      for(var i = 0; i < messages.length; i++){
        if(!messages[i].haveLink){
          if(messages[i].fromWho == username){
            $('.messages-container').append(`
            <div class="message-container">
              <div class="message-home my-message-home">
                <div class="message my-message">${messages[i].message}</div>
              </div>
            </div>
            `);
          }else{
            $('.messages-container').append(`
            <div class="message-container">
              <div class="message-home another-message-home">
                <div class="message another-message">${messages[i].message}</div>
              </div>
            </div>
            `);
          }
          setTimeout(() => {
            const element = document.getElementById('messages-container');
            element.scrollTop = element.scrollHeight;
          });
        }else{
          const data = {
            fromWho: messages[i].fromWho,
            toWho: messages[i].toWho,
            line: messages[i].line,
            haveLink: true,
            secretID: messages[i].secretID,
            beforeLink: messages[i].beforeLink,
            afterLink: messages[i].afterLink,
            link: messages[i].link
          }
          createMessage(data);
        }
      }
    }, 500);
  });

  socket.on('NEW_MESSAGE_DATA', (data) => {createMessage(data);});

  const messageWithLink = (data) => {setTimeout(() => {
    if(data.beforeLink[0]){
      for(var i = 0; i < data.beforeLink.length; i++){
        $(`.${data.secretID}`).append(`${data.beforeLink[i]} `);
      }
      setTimeout(() => {
        $(`.${data.secretID}`).append(`
        <b><a class="message-link" href="${data.link}" target="_blank">${data.link} </a></b>
        `);
        setTimeout(() => {
          if(data.afterLink[1]){
            for(var i = 0; i < data.afterLink.length-1; i++){
              $(`.${data.secretID}`).append(`${data.afterLink[i+1]} `);
            }
          }
        });
      });
    }else{
      $(`.${data.secretID}`).append(`
      <b><a class="message-link" href="${data.link}" target="_blank">${data.link} </a></b>
      `);
      setTimeout(() => {
        if(data.afterLink[1]){
          for(var i = 0; i < data.afterLink.length-1; i++){
            $(`.${data.secretID}`).append(`${data.afterLink[i+1]} `);
          }
        }
      });
    }
    setTimeout(() => {
      const element = document.getElementById('messages-container');
      element.scrollTop = element.scrollHeight;
    });
  });}

  const createMessage = (data) => {
    if(!data.haveLink){
      if(data.fromWho == username){
        // My message
        $('.messages-container').append(`
        <div class="message-container">
          <div class="message-home my-message-home">
            <div class="message my-message ${data.secretID}">${data.message}</div>
          </div>
        </div>
        `);
      }else{
        if(data.fromWho == friendName && data.toWho == username){
          // Another people message
          $('.messages-container').append(`
          <div class="message-container">
            <div class="message-home another-message-home">
              <div class="message another-message ${data.secretID}">${data.message}</div>
            </div>
          </div>
          `);
        }
      }
      setTimeout(() => {
        const element = document.getElementById('messages-container');
        element.scrollTop = element.scrollHeight;
      });
    }else{
      if(data.fromWho == username){
        // My message with link
        $('.messages-container').append(`
        <div class="message-container">
          <div class="message-home my-message-home">
            <div class="message my-message  ${data.secretID}"></div>
          </div>
        </div>
        `);
        messageWithLink(data);
      }else{
        if(data.fromWho == friendName && data.toWho == username){
          // Another people message with link
          $('.messages-container').append(`
          <div class="message-container">
            <div class="message-home another-message-home">
              <div class="message another-message ${data.secretID}"></div>
            </div>
          </div>
          `);
        }
        messageWithLink(data);
      }
    }
    setTimeout(() => {
      const element = document.getElementById('messages-container');
      element.scrollTop = element.scrollHeight;
    }, 10);
  }

  // Animations
  let counter = 'empty';
  socket.on('SOMETHING_WRONG_ADD_FRIEND', (data) => {
    $('.info-message-add').html(`${data.text}`);
  });
  socket.on('SOMETHING_WRONG_DELETE_FRIEND', (data) => {
    $('.info-message-delete').html(`${data.text}`);
  });
  
  $('.add_friend').on('click', () => {open_add_friend_column();});
  $('.delete_friend').on('click', () => {open_delete_friend_column();});
  $('.close_setting').on('click', () => {
    if(counter == 'add-friend-now'){
      counter = 'empty';
      add_friend_home.className = 'add_friend_home setting setting-animation-blackout';
      setTimeout(() => {
        $('.setting').hide();
        peopleColumn.className = 'people-column people-column-animation-down';
        peopleColumn.style.height = '420px';
      }, 480);
    }
    if(counter == 'delete-friend-now'){
      counter = 'empty';
      delete_friend_home.className = 'delete_friend_home setting setting-animation-blackout';
      setTimeout(() => {
        peopleColumn.style.height = '420px';
        peopleColumn.className = 'people-column people-column-animation-down';
        $('.setting').hide();
      }, 480);
    }
  });

  const add_friend_input = document.getElementById('add-friend-input');
  const numbers = [0,1,2,3,4,5,6,7,8,9]
  $('.permiss_add_friend').on('click', () => {
    setTimeout(() => {
      const add_friend_value = add_friend_input.value;
      if(add_friend_value){
        let steps = false;
        var chars = [];
        for(var i = 0; i < add_friend_value.length; i++){
          chars.push(add_friend_value.charAt(i));
        }
        for(var i = 0; i < chars.length; i++){
          for(var j = 0; j < numbers.length; j++){
            if(chars[i] == numbers[j]){
              if(chars.length == 6){
                steps = true;
              }
            }
          }
          if(!steps){
            $('.info-message-add').html(`Lütfen <b>6</b> haneli bir <b>sayı</b> giriniz`);
            return false;
          }else{
            finish = true;
          }
        }
        if(finish){
          socket.emit('ADD_NEW_FRIEND', { add_friend_value, id, username });
        }
      }else{
        $('.info-message-add').html('Herhangi bir karakter girmediniz');
      }
    }, 100);
  });

  const delete_friend_input = document.getElementById('delete-friend-input');
  $('.permiss_delete_friend').on('click', () => {
    setTimeout(() => {
      const delete_friend_value = delete_friend_input.value;
      if(delete_friend_value){
        let finish = false;
        let steps = false;
        var chars = [];
        for(var i = 0; i < delete_friend_value.length; i++){
          chars.push(delete_friend_value.charAt(i));
        }
        for(var i = 0; i < chars.length; i++){
          for(var j = 0; j < numbers.length; j++){
            if(chars[i] == numbers[j]){
              if(chars.length == 6){
                steps = true;
              }
            }
          }
          if(!steps){
            $('.info-message-delete').html(`Lütfen <b>6</b> haneli bir <b>sayı</b> giriniz`);
            return false;
          }else{
            finish = true;
          }
        }
        if(finish){
          socket.emit('DELETE_FRIEND', { delete_friend_value, id, username });
        }
      }else{
        $('.info-message-delete').html('Herhangi bir karakter girmediniz');
      }
    }, 100);
  });
});