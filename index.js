const { centerBoldGray, centerBold, rightBold } = require('./styles')
const { getVarName } = require('./helpers/helper')
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

// CASH IN
const { openingBalance, cashIn } = cashflow.cashflowObj[0];

tables.firstHalf.body.push([{
  text: 'CASH IN',
  colSpan: 17,
  fontSize: 7,
  bold: true
}]);

const { categoryName, position } = insertCategory('firstHalf', {openingBalance}, centerBold, rightBold);
const total = (cashflow.bothHalfTotal[categoryName][0]).toFixed(2);
tables.firstHalf.body[position].push(rightBold(total));

let listTableDocs = {
  pageSize: 'A4',
  pageOrientation: 'landscape',
  content: [
    { table: tables.firstHalf },
  ],
};

const pdfDoc = pdfmake.createPdfKitDocument(listTableDocs, {});
pdfDoc.pipe(fs.createWriteStream('pdfs/listtable.pdf'));
pdfDoc.end();

// TABLE FUNCTIONS
function insertCategory(table, category, categoryStyle, valueStyle){
  const categoryName = getVarName(category);
  const stcaseCategory = startCase(categoryName);
  const position = tables[table].body.length
  const values = category[categoryName];

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