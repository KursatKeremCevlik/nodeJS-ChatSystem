$(() => {
    const invis = () => {
        // Make invis
        $('.TRUE-VALUES').hide();
        $('.WRONG-NAME').hide();
        $('.WRONG-SURNAME').hide();
        $('.WRONG-YEAR').hide();
        $('.WRONG-USERNAME').hide();
        $('.WRONG-PASSWORD').hide();
        $('.WRONG-NAME-LENGTH').hide();
    }
    invis();

    const socket = io.connect('http://localhost:3000');

    const Form = document.getElementById('form');
    const Buton = document.getElementById('buton');
    Buton.value = 'Kayıt için gönder';
    const Name = document.getElementById('name');
    const Surname = document.getElementById('surname');
    const Year = document.getElementById('year');
    const Username = document.getElementById('username');
    const Password = document.getElementById('password');

    Form.addEventListener('submit', e => {
        e.preventDefault();
        const name = Name.value;
        const surname = Surname.value;
        const year = Year.value;
        const username = Username.value;
        const password = Password.value;

        socket.emit('VARIABLES_LOGIN', { name, surname, year, username, password });
    });

    socket.on('TRUE_VALUES_LOGIN', () => {
        Name.value = '';
        Surname.value = '';
        Year.value = '';
        Username.value = '';
        Password.value = '';
        invis();
        $('.TRUE-VALUES').show();
        $('.GO-SIGNIN').show();
        $('.LINK').show();
    });
    socket.on('WRONG_NAME_LOGIN', () => {
        invis();
        $('.WRONG-NAME').show();
    });
    socket.on('WRONG_SURNAME_LOGIN', () => {
        invis();
        $('.WRONG-SURNAME').show();
    });
    socket.on('WRONG_YEAR_LOGIN', () => {
        invis();
        $('.WRONG-YEAR').show();
    });
    socket.on('WRONG_USERNAME_LOGIN', () => {
        invis();
        $('.WRONG-USERNAME').show();
    });
    socket.on('WRONG_PASSWORD_LOGIN', () => {
        invis();
        $('.WRONG-PASSWORD').show();
    });
    socket.on('WRONG_NAMELENGTH_LOGIN', (data) => {
        invis();
        $('.WRONG-NAME-LENGTH').show();
        $('.WRONG-NAME-LENGTH').html(`${data.text}`);
    });
});