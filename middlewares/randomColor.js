module.exports = (colors, peopleArr) => {
  const colorLine = Math.floor(Math.random() * colors.length);
  const color = colors[colorLine];
  return color;
  /*if(!peopleArr[0]){
    // Generate random color as you want
    // This block work 1 time
  }else{
    // Generate DIFFERENT colors
    let a = true;
    while(a){
      let finish = true;
      const colorLine = Math.floor(Math.random() * colors.length);
      const color = colors[colorLine]
      for(var i = 0; i < peopleArr.length; i++){
        if(color == peopleArr[i].color){
          // Generate another random color
          finish = false;
        }
      }
      setTimeout(() => {
        if(finish){
          // This color is acceptable
          a = false;
          return color;
        }
      });
    }
  }
  */
}