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
  }

  const a = 11;
  for(var i = 0; i < a; i++){
    const peopleColumn = document.getElementById('people-column');
    const person = document.createElement('div');
    person.className = 'person';
    const people_hr = document.createElement('div');
    people_hr.className = 'people_hr';
    person.appendChild(people_hr);
    const people = document.createElement('div');
    people.className = 'people';
    person.appendChild(people);
    const people_name = document.createElement('div');
    people_name.className = 'people_name';
    const node = document.createTextNode('Kürşat Kerem');
    people_name.appendChild(node);
    people.appendChild(people_name);
    person.appendChild(people_hr);
  
    peopleColumn.appendChild(person);
    $('.example').html('example');
  }
});