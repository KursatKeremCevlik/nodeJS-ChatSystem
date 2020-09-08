$(() => {
    const socket = io.connect('https://example-chat-system.herokuapp.com/');

    socket.on('ADMIN_DATAS', (data) => {
        for(var i = 0; i < data.length; i++){
            let veri = data[i];
            $('.DataBase').append(
            `<div class="userData">
                <div class="datas">
                    <a class="home nameHome">Name: <a class="name">${veri.name}</a></a>
                    <a class="home surnameHome">Surname: <a class="surname">${veri.surname}</a></a>
                    <a class="home yearHome">Year: <a class="year">${veri.year}</a></a>
                    <a class="home usernameHome">Username: <a class="username">${veri.username}</a></a>
                    <a class="home passwordHome">Password: <a class="password">${veri.password}</a></a>
                </div>
            </div>`
            );
        }
    });

    const Form = document.getElementById('form');
    const Buton = document.getElementById('buton');
    Buton.value = 'Kontrol et';

    const Username = document.getElementById('username');
    const Password = document.getElementById('password');
    Form.addEventListener('submit', e => {
        e.preventDefault();
        const username = Username.value;
        const password = Password.value;

        socket.emit('IM_ADMIN', { username, password });

        Username.value = '';
        Password.value = '';
    });

    socket.on('TRUE_ADMIN_DATA', () => {
        $('.form').hide();
        $('.DATAS').show();
    });
    socket.on('CLEAR_TEXT', () => {
        $('.form-text').html('');
    });
    socket.on('CONTROL-1', () => {
        $('.form-text').html('Kontrol ediliyor.');
    });
    socket.on('CONTROL-2', () => {
        $('.form-text').html('Kontrol ediliyor..');
    });
    socket.on('CONTROL-3', () => {
        $('.form-text').html('Kontrol ediliyor...');
    });
    socket.on('WRONG_USERNAME_ADMIN', () => {
        $('.form-text').html('Kullanıcı adı girmediniz !');
    });
    socket.on('WRONG_PASSWORD_ADMIN', () => {
        $('.form-text').html('Şifrenizi girmediniz !');
    });
    socket.on('WRONG_ADMIN_DATA', () => {
        $('.form-text').html('Kullanıcı adı veya şifreniz hatalı !');
    });

    $('.addAdmin').on('click', () => {
        console.log('yarın devam etçem');
    });
});