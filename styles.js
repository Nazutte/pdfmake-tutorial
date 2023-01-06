function centerBoldGray(text){
  return {
    text,
    alignment: 'center',
    fontSize: 6,
    bold: true,
    fillColor: '#dedede'
  }
}

function centerBold(text){
  return {
    text,
    alignment: 'center',
    fontSize: 6,
    bold: true,
  }
}

function rightBold(text){
  return {
    text,
    alignment: 'right',
    fontSize: 6,
    bold: true,
  }
}

module.exports = {
  centerBoldGray,
  centerBold,
  rightBold,
};