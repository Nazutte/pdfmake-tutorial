const fontSize = 4;

function centerBoldGray(text){
  return {
    text,
    alignment: 'center',
    fontSize,
    bold: true,
    fillColor: '#dedede'
  }
}

function centerBold(text){
  return {
    text,
    alignment: 'center',
    fontSize,
    bold: true,
  }
}

function rightBold(text){
  return {
    text,
    alignment: 'right',
    fontSize,
    bold: true,
  }
}

function right(text){
  return {
    text,
    alignment: 'right',
    fontSize,
  }
}

module.exports = {
  centerBoldGray,
  centerBold,
  rightBold,
  right,
};