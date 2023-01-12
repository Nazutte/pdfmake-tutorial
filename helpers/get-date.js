function toStringDate(date){
  return (date.getFullYear()) + '-' + (date.getMonth() + 1) + '-' + (date.getDate());
}

function getPreviousDate(stringDate){
  let date = new Date(stringDate);
  date.setDate(date.getDate() - 1);
  date = (date.getFullYear()) + '-' + (date.getMonth() + 1) + '-' + (date.getDate());
  return date;
}

function getStartAndEndDate(year, month){
  console.log(year, month);
  return {
    startDate: year + '-' + month + '-' + '1',
    endDate: year + '-' + month + '-' + new Date(year, month, 0).getDate()
  }
}

function getAmountOfDays(date){
  date = new Date(date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return new Date(year, month, 0).getDate();
}

function getDatesInRange(startDate, endDate) {
  const date = new Date(startDate.getTime());
  const dates = [];

  while (date <= endDate) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return dates;
}

module.exports = {
  getStartAndEndDate, 
  getPreviousDate,
  toStringDate,
  getAmountOfDays,
  getDatesInRange,
};