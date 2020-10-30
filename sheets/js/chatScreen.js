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
  const add_friend_home = document.getElementById('add_friend_home');
  const delete_friend_home = document.getElementById('delete_friend_home');
  const peopleColumn = document.getElementById('people-column');
  const person = document.createElement('div');

  socket.emit('PLEASE_PROFILE_DATAS', { id, username });
  socket.on('FRIEND_DATAS', (data) => {
    if(data.username == username){
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
        console.log(people.className);
      }
    }
  });
  peopleColumn.appendChild(person);

  let counter = 'empty';
  socket.on('CLEAR-PEOPLE-COLUMN', (data) => {
    if(data.usernameValue == username){
      $('.person').html('');
    }
  });
  socket.on('SOMETHING_WRONG_ADD_FRIEND', (data) => {
    $('.info-message-add').html(`${data.text}`);
  });
  socket.on('SOMETHING_WRONG_DELETE_FRIEND', (data) => {
    $('.info-message-delete').html(`${data.text}`);
  });
  
  $('.add_friend').on('click', () => {
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
  });
  $('.delete_friend').on('click', () => {
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
  });
  $('.close_setting').on('click', () => {
    if(counter == 'add-friend-now'){
      counter = 'empty';
      add_friend_home.className = 'add_friend_home setting setting-animation-blackout';
      setTimeout(() => {
        $('.setting').hide();
        peopleColumn.className = 'people-column people-column-animation-down';
        peopleColumn.style.height = '420px';
      }, 490);
    }
    if(counter == 'delete-friend-now'){
      counter = 'empty';
      delete_friend_home.className = 'delete_friend_home setting setting-animation-blackout';
      setTimeout(() => {
        peopleColumn.style.height = '420px';
        peopleColumn.className = 'people-column people-column-animation-down';
        $('.setting').hide();
      }, 490);
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