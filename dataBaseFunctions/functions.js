module.exports = (PRM, socket, data, Account) => {
  // 1 -- Adding a new friends
  if(PRM == 'add_new_friend'){
    if(data){
      if(data.friendName){
        Account.findOne((err, foundObject) => {
          if(!err){
            foundObject.friends.push(data.friendName);
            foundObject.save((err, updateObject) => {
              if(!err){
                let message = 'Data has been saved successfully !';
                socket.emit('SUCCESS_SAVE', { message });
              }else{
                let message = 'Something wrong !';
                socket.emit('WRONG_SAVE', { message });
              }
            });
          }
        });
      }
    }
  }

  // Adding a new account
  if(PRM == 'add_new_account'){
    if (!data.name) {
      socket.emit('WRONG_NAME_LOGIN');
    } else if (data.name.length > 12) {
      socket.emit('WRONG_NAMELENGTH_LOGIN', { text: 'İsminizin karakter sayısı 12 den küçük olmalıdır.' });
    } else if (!data.surname) {
      socket.emit('WRONG_SURNAME_LOGIN');
    } else if (!data.year) {
      socket.emit('WRONG_YEAR_LOGIN');
    } else if (!data.username) {
      socket.emit('WRONG_USERNAME_LOGIN');
    } else if (!data.password) {
      socket.emit('WRONG_PASSWORD_LOGIN');
    } else {
      const account = new Account({
        name: data.name,
        surname: data.surname,
        username: data.username,
        password: data.password,
        year: data.year,
      });
      account.save();
      socket.emit('TRUE_VALUES_LOGIN');
    }
  }
}