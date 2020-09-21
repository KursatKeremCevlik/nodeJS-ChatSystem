$(() => {
    let my_name;
    const socket = io.connect('https://example-chat-system.herokuapp.com/');

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
        $('.LINKHOME').show();
        $('.LINK').show();
        my_name = data.name;
        socket.emit('CONTINUE');
    });
    socket.on('WRONG_ACCOUNT_VALUES', () => {
        invis();
        $('.WRONG_ACCOUNT').show();
    });
    socket.on('OK_CONTINUE', () => {
        invis();
        $('.hero-title').hide();
        $('.messages').hide();
        $('#SignInForm').hide();
        $('.LINKHOME').hide();
        const Body = document.getElementById('body');
        Body.style.background = '#262d31';
        $('.CHAT').show();
        socket.emit('CHAT_ONLINE', { my_name });
    });

    const FormChat = document.getElementById('formChat');
    const ButonChat = document.getElementById('butonChat');

    FormChat.addEventListener('submit', e => {
        e.preventDefault();
        const Message = document.getElementById('message_inputChat');
        const message = Message.value;

        socket.emit('MESSAGE_CHAT', { message, my_name });
        Message.value = '';
    });

    socket.on('NEW_MESSAGE_CHAT', (data) => {
        if(data.type == 1){
            // Ekrana bas karşı mesaj
            $('.messages-sizeChat').append(`<div class="messages-2Chat">
                <a class="messages_allChat">${data.message}</a>
                <br />
                <div class="borderHome">
                    <a class="border">${data.name}</a>
                </div>
            </div>`);
        }
    });
    socket.on('NEW_MESSAGE_FIRST_CHAT', (data) => {
        if(data.type == 0){
            // Ekrana bas kendi mesajın
            // Mesaj 25 karakterden fazlaysa aşağı satıra in
            $('.messages-sizeChat').append(`<div class="messages-1Chat">
                <a class="messages_allChat">${data.message}</a>
                <br />
                <div class="borderHome">
                    <a class="border">${data.name}</a>
                </div>
            </div>`);
        }
    });

    socket.on('SOMEONE_ONLINE', (data) => {
        $('.onlineCountsChat').html('');
        for(var i = 0; i < data.length; i++){
            if(data[i]){
                let veri = data[i]
                $('.onlineCountsChat').append(`<a class="OnlinePeople">${veri.OnlineName}</a>`);
            }
        }
    });
    socket.on('FROM_DATABASE', (veri) => {
        if(veri.name == my_name){
            $('.messages-sizeChat').append(`<div class="messages-1Chat">
                <a class="messages_allChat">${veri.message}</a>
                <br />
                <div class="borderHome">
                    <a class="border">${veri.name}</a>
                </div>
            </div>`);
        }else{
            $('.messages-sizeChat').append(`<div class="messages-2Chat">
                <a class="messages_allChat">${veri.message}</a>
                <br />
                <div class="borderHome">
                    <a class="border">${veri.name}</a>
                </div>
            </div>`);
        }
    });
});