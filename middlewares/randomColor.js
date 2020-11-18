module.exports = (colors) => {
  const colorLine = Math.floor(Math.random() * colors.length);
  const color = colors[colorLine];
  return color;
}