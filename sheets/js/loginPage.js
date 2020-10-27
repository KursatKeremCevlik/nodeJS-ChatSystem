$(() => {
  const socket = io.connect('https://example-chat-system.herokuapp.com/');
  // let socket = io.connect('http://localhost:3000');
  
  $('.secondPage').hide();
  let remember_me_value = false;

  localStorage.setItem('test', 'test');
  const test = localStorage.getItem('test');
  if(test == null){
    $('.firstPage').hide();
    $('.secondPage').show();
    socket = false;
  }else{
    $('.info-pharagraph').html(`Bu siteyi kullanmak için localstroga'a ihtiyacımız var. Görünüşe göre sen localstorage özelliğini açmışsın. Sen siteyi kullanabilirsin.`);
    localStorage.removeItem('test');
  }
  
  const Form = document.getElementById('form');
  const Button = document.getElementById('button');
  Button.value = 'Giriş yap';

  const Username = document.getElementById('username');
  const Password = document.getElementById('password');
  Form.addEventListener('submit', e => {
    e.preventDefault();
    const username = Username.value;
    const password = Password.value;
    socket.emit('LOGIN_DATAS', { username, password });
  });

  socket.on('LOGIN_INFO_TEXT', (data) => {
    if(data.permission == 1){
      // True account datas
      $('.message').html(`${data.text}`);
      localStorage.setItem('kursatkerem-chat-system-username', Username.value);
      localStorage.setItem('kursatkerem-chat-system-remember-me-value', remember_me_value);
      localStorage.setItem('kursatkerem-chat-system-account-id', data.id);
      Username.value = '';
      Password.value = '';
      setTimeout(() => {
        location.href = '/chat';
      }, 1000);
    }else if(data.permission == 2){
      // Wrong account datas
      $('.message').html(`${data.text}`);
      Password.value = '';
    }else{
      // Empty values
      $('.message').html(`${data.text}`);
    }
  });

  const Example = document.getElementById('remember-me');
  $('#remember-me').on('click', () => {
    remember_me_value ? remember_me_value = false : remember_me_value = true;
  });
});