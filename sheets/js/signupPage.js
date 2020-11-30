$(() => {
  const socket = io.connect('/');

  const Form = document.getElementById('form');
  const Button = document.getElementById('button');
  Button.value = 'Kayıt için gönder';
  
  const Name = document.getElementById('name');
  const Surname = document.getElementById('surname');
  const Username = document.getElementById('username');
  const Password = document.getElementById('password');
  Form.addEventListener('submit', e => {
    e.preventDefault();
    const name = Name.value;
    const surname = Surname.value;
    const username = Username.value;
    const password = Password.value;
    socket.emit('SIGNUP_DATAS', {
      name,
      surname,
      username,
      password
    });

    socket.on('INFO_DATA', (data) => {
      if(data.info){
        Name.value = '';
        Surname.value = '';
        Username.value = '';
        Password.value = '';
        $('.message').html(`${data.text}`);
        setTimeout(() => {
          $('.message').html('Yönlendiriliyorsunuz');
        }, 500);
        setTimeout(() => {
          location.href = '/login';
        }, 1500);
      }else{
        $('.message').html(`${data.text}`);
      }
    });
  });
});