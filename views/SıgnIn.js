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
        $('.CHAT').hide();
        $('.WRONG_ACCOUNT').hide();
    }
    invis();
    
    const Form = document.getElementById('SignInForm');
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
    socket.on('WRONG_ACCOUNT_VALUES', () => {
        invis();
        $('.WRONG_ACCOUNT').show();
    });
    $('.LINK').on('click', () => {
        invis();
        $('.hero-title').hide();
        $('.messages').hide();
        $('#SignInForm').hide();
        $('.LINKHOME').hide();
        const Body = document.getElementById('body');
        Body.style.background = 'lightgreen';
        $('.CHAT').show();
        socket.emit('IAM_ONLINE');
    });

    socket.on('WRONG_ACCOUNT', () => {
        $('.CHAT').hide();
    });

    const FormChat = document.getElementById('formChat');
    const ButonChat = document.getElementById('butonChat');

    FormChat.addEventListener('submit', e => {
        e.preventDefault();
        const Message = document.getElementById('message_inputChat');
        const message = Message.value;

        socket.emit('MESSAGE_CHAT', { message });
        Message.value = '';
    });

    socket.on('NEW_MESSAGE_CHAT', (data) => {
        if(data.type == 1){
            // Ekrana bas karşı mesaj
            $('.messages-sizeChat').append(`<div class="messages-2Chat"><a class="messages_allChat">${data.message}</a></div>`);
        }
    });
    socket.on('NEW_MESSAGE_FIRST_CHAT', (data) => {
        if(data.type == 0){
            // Ekrana bas kendi mesajın
            $('.messages-sizeChat').append(`<div class="messages-1Chat"><a class="messages_allChat">${data.message}</a></div>`);
        }
    });
});