$(() => {
    const socket = io.connect('http://localhost:3000');
    
    const invis = () => {
        $('.WRONG_USERNAME').hide();
        $('.WRONG_PASSWORD').hide();
        $('.TRUE_SIGNIN').hide();
        $('.WAIT-1').hide();
        $('.WAIT-2').hide();
        $('.WAIT-3').hide();
        $('.LINK').hide();
    }
    invis();
    
    const Form = document.getElementById('SıgnInForm');
    const Buton = document.getElementById('Buton');
    Buton.value = 'Giriş yapmak için doğrula';

    Form.addEventListener('submit', e => {
        e.preventDefault();
        const Username = document.getElementById('username');
        const Password = document.getElementById('password');

        const username = Username.value; 
        const password = Password.value; 
        
        socket.emit('VARIABLES_SIGNIN', { username, password });
        
        Username.value =    '';
        Password.value = '';
    });

    socket.on('WRONG_USERNAME_SIGNIN', () => {
        invis();
        $('.WRONG_USERNAME').show();
        console.log('kullanıcı adı girmedin');
    });
    socket.on('WRONG_PASSWORD_SIGNIN', () => {
        invis();
        $('.WRONG_PASSWORD').show();
    });
    socket.on('CLEAR_SIGNIN', () => {
        invis();
    });
    socket.on('CLEAR_SIGNIN-1', () => {
        invis();
        $('.WAIT-1').show();
    });
    socket.on('CLEAR_SIGNIN-2', () => {
        invis();
        $('.WAIT-2').show();
    });
    socket.on('CLEAR_SIGNIN-3', () => {
        invis();
        $('.WAIT-3').show();
    });
    socket.on('FIND_SIGNIN', (data) => {
        invis();
        $('.TRUE_SIGNIN').show();
        $('.TRUE_SIGNIN').html(`Hoş geldin <a class="name">${data.name} ${data.surname}</a> <br>`);
        $('.LINKHOME').show();
        $('.LINK').show();
    });
});