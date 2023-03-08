const fontSize = 3;

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

function rightBoldGray(text){
  return {
    text,
    alignment: 'right',
    fontSize,
    bold: true,
    fillColor: '#dedede',
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
  rightBoldGray,
  rightBold,
  right,
};