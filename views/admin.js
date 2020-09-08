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
        $('.privateHR-2').hide();
        $('.text').hide();
        $('.DATAS').hide();
        $('.ADD_ADMIN_PAGE').show();
    });

    const AdminForm = document.getElementById('AdminForm');
    const AddingButton = document.getElementById('addingButton');
    AddingButton.value = 'Ekle';

    const Name_admin = document.getElementById('name_admin');
    const Surname_admin = document.getElementById('surname_admin');
    const Year_admin = document.getElementById('year_admin');
    const Username_admin = document.getElementById('username_admin');
    const Password_admin = document.getElementById('password_admin');
    AdminForm.addEventListener('submit', e => {
        e.preventDefault();
        const name_admin = Name_admin.value;
        const surname_admin = Surname_admin.value;
        const year_admin = Year_admin.value;
        const username_admin = Username_admin.value;
        const password_admin = Password_admin.value;

        socket.emit('ADD_ADMIN', { 
            name_admin,
            surname_admin,
            year_admin,
            username_admin,
            password_admin
        });
    });

    const invis = () => {
        $('.messages').hide();
        $('.WRONG_NAME_ADD').hide();
        $('.WRONG_SURNAME_ADD').hide();
        $('.WRONG_YEAR_ADD').hide();
        $('.WRONG_USERNAME_ADD').hide();
        $('.WRONG_PASSWORD_ADD').hide();
        $('.TRUE_SAVE_ADMIN').hide();
    }

    socket.on('WRONG_NAME_ADMIN_ADD', () => {
        invis();
        $('.messages').show();
        $('.WRONG_NAME_ADD').show();
    });
    socket.on('WRONG_SURNAME_ADMIN_ADD', () => {
        invis();
        $('.messages').show();
        $('.WRONG_SURNAME_ADD').show();
    });
    socket.on('WRONG_YEAR_ADMIN_ADD', () => {
        invis();
        $('.messages').show();
        $('.WRONG_YEAR_ADD').show();
    });
    socket.on('WRONG_USERNAME_ADMIN_ADD', () => {
        invis();
        $('.messages').show();
        $('.WRONG_USERNAME_ADD').show();
    });
    socket.on('WRONG_PASSWORD_ADMIN_ADD', () => {
        invis();
        $('.messages').show();
        $('.WRONG_PASSWORD_ADD').show();
    });
    socket.on('TRUE_SAVE_ADMIN', () => {
        invis();
        $('.messages').show();
        $('.TRUE_SAVE_ADMIN').show();
        Name_admin.value = '';
        Surname_admin.value = '';
        Year_admin.value = '';
        Username_admin.value = '';
        Password_admin.value = '';
        $('.goBackAdminPage').show();
        $('#addingButton').hide();
    });
    $('.goBackAdminPage').on('click', () => {
        invis();
        $('.privateHR-2').show();
        $('.text').show();
        $('.DATAS').show();
        $('.ADD_ADMIN_PAGE').hide();
    });
});