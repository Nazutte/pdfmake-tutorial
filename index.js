const { centerBoldGray, centerBold, rightBold, right } = require('./styles')
const { startCase } = require('lodash')
const cashflow = require('./resources/cashflow-obj.json')
const fs = require('fs')
const Pdfmake = require('pdfmake')

const fonts = {
  Roboto: {
    normal: 'fonts/Roboto-Regular.ttf',
    bold: 'fonts/Roboto-Medium.ttf',
    italics: 'fonts/Roboto-Italic.ttf',
    bolditalics: 'fonts/Roboto-MediumItalic.ttf',
  }
};

const pdfmake = new Pdfmake(fonts);

let tables = {
  firstHalf: {
    headerRows: 1,
    widths: [],
    body: [[]],
  },
  secHalf: null,
}

let firstHalf = {
  headerRows: 1,
  widths: [],
  body: [
    [],
  ],
};

// TABLE SETUP
tables.firstHalf.widths.push(80);
tables.firstHalf.body[0].push(centerBoldGray('Details'));
for(let count = 0; count < 15; count++){
  tables.firstHalf.widths.push('*');
  tables.firstHalf.body[0].push(centerBoldGray(count + 1));
}
tables.firstHalf.widths.push('*');
tables.firstHalf.body[0].push(centerBoldGray('Total'));

const { openingBalance, cashIn } = cashflow.cashflowObj[0];
// CASH IN
tables.firstHalf.body.push([{
  text: 'CASH IN',
  colSpan: 17,
  fontSize: 5,
  bold: true,
  fillColor: '#b2d3c2',
}]);

const { categoryName, position } = insertCategory('firstHalf', 'openingBalance', openingBalance, centerBold, rightBold);
const total = (cashflow.bothHalfTotal[categoryName][0]).toFixed(2);
tables.firstHalf.body[position].push(rightBold(total));

insertTypeIn('cashIn');

tables.firstHalf.body.push([{
  text: 'CASH OUT',
  colSpan: 17,
  fontSize: 5,
  bold: true,
  fillColor: '#ffa8b5',
}]);

insertTypeIn('cashOut');

let listTableDocs = {
  pageSize: 'A4',
  pageOrientation: 'landscape',
  pageMargins: [ 15, 15, 15, 15 ],
  content: [
    { table: tables.firstHalf },
  ],
};

console.log(listTableDocs.content[0].table.body);
console.log(cashflow.cashflowObj[0].allTotal);

const pdfDoc = pdfmake.createPdfKitDocument(listTableDocs, {});
pdfDoc.pipe(fs.createWriteStream('pdfs/listtable.pdf'));
pdfDoc.end();

// TABLE FUNCTIONS
function insertTypeIn(cashflowTypeString){
  const cashflowType = cashflow.cashflowObj[0][cashflowTypeString];
  for(const type in cashflowType){
    console.log(type);
    tables.firstHalf.body.push([{
      text: startCase(type),
      colSpan: 17,
      fontSize: 5,
      bold: true,
      fillColor: '#dedede',
    }]);

    for(const category in cashflowType[type]){
      console.log('- ' + category);
      console.log('-- ' + cashflowType[type][category]);
      const { categoryName, position } = insertCategory('firstHalf', category, cashflowType[type][category], centerBold, right);
      tables.firstHalf.body[position].push(rightBold('fne'));
    }

    const total = cashflow.cashflowObj[0].allTotal[type];
    const { categoryName, position } = insertCategory('firstHalf', 'TOTAL', total, centerBold, rightBold);
    tables.firstHalf.body[position].push(rightBold('fne'));
  }
}

function insertCategory(table, categoryName, values, categoryStyle, valueStyle){
  const stcaseCategory = startCase(categoryName);
  const position = tables[table].body.length

  tables[table].body.push([]);
  tables[table].body[position].push(categoryStyle(stcaseCategory));
  for(let count = 0; count < 15; count++){
    let value = values[count];
    if(typeof value != 'number'){
      if(value.amount){
        value = value.amount;
      } else {
        value = 0;
      }
    }
    value = (value).toFixed(2);
    tables[table].body[position].push(valueStyle(value));
  }

  return { categoryName, position };
}