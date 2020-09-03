module.exports = (param, socket, data, Account) => {
  if(param == 'add_friend'){
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
}