const { centerBoldGray, centerBold, rightBoldGray, rightBold, right } = require('./styles')
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

const diffCashIn = ['securityDeposit'];
insertTypeIn('cashIn', diffCashIn);

tables.firstHalf.body.push([{
  text: 'CASH OUT',
  colSpan: 17,
  fontSize: 5,
  bold: true,
  fillColor: '#ffa8b5',
}]);

const diffCashOut = ['cashOutOther'];
insertTypeIn('cashOut', diffCashOut);

tables.firstHalf.body.push([{
  text: 'OTHER BALANCE',
  colSpan: 17,
  fontSize: 5,
  bold: true,
}]);

let listTableDocs = {
  pageSize: 'A4',
  pageOrientation: 'landscape',
  pageMargins: [ 15, 15, 15, 15 ],
  content: [
    { table: tables.firstHalf },
  ],
};

const { float, pettyCash } = cashflow.cashflowObj[0].balance;
const balanceTotal = cashflow.cashflowObj[0].allTotal.balance;
const safeBalance = cashflow.cashflowObj[0].allTotal.safeBalance;

const { position: floatPos } = insertCategory('firstHalf', 'float', float, centerBold, rightBold);
tables.firstHalf.body[floatPos].push(rightBold('fne'));

const { position: pettyCashPos } = insertCategory('firstHalf', 'pettyCash', pettyCash, centerBold, rightBold);
tables.firstHalf.body[pettyCashPos].push(rightBold('fne'));

const { position: balanceTotalPos } = insertCategory('firstHalf', 'TOTAL', balanceTotal, centerBoldGray, rightBoldGray);
tables.firstHalf.body[balanceTotalPos].push(rightBoldGray('fne'));

const { position: safeBalancePos } = insertCategory('firstHalf', 'Total Safe Balance', safeBalance, centerBoldGray, rightBoldGray);
tables.firstHalf.body[safeBalancePos].push(rightBoldGray('fne'));

const pdfDoc = pdfmake.createPdfKitDocument(listTableDocs, {});
pdfDoc.pipe(fs.createWriteStream('pdfs/listtable.pdf'));
pdfDoc.end();

// TABLE FUNCTIONS
function insertTypeIn(cashflowTypeString, diff){
  const cashflowType = cashflow.cashflowObj[0][cashflowTypeString];
  for(const type in cashflowType){
    const found = diff.find(element => element == type);
    if(!found){
      tables.firstHalf.body.push([{
        text: startCase(type),
        colSpan: 17,
        fontSize: 5,
        bold: true,
        fillColor: '#dedede',
      }]);
  
      for(const category in cashflowType[type]){
        const { categoryName, position } = insertCategory('firstHalf', category, cashflowType[type][category], centerBold, right);
        tables.firstHalf.body[position].push(rightBold('fne'));
      }
  
      const total = cashflow.cashflowObj[0].allTotal[type];
      const { categoryName, position } = insertCategory('firstHalf', 'TOTAL', total, centerBold, rightBold);
      tables.firstHalf.body[position].push(rightBold('fne'));
    }
  }

  diff.forEach(typeString => {
    const type = cashflowType[typeString];
    for(const category in type){
      const { categoryName, position } = insertCategory('firstHalf', category, type[category], centerBold, right);
      tables.firstHalf.body[position].push(rightBold('fne'));
    }
  });
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