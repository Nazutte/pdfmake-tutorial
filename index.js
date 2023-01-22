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
  secHalf: {
    headerRows: 1,
    widths: [],
    body: [[]],
  },
}

const table = ['firstHalf', 'secHalf'];
makeTable(table[0], 2022, 09);
makeTable(table[1], 2022, 09);

let listTableDocs = {
  pageSize: 'A4',
  pageOrientation: 'landscape',
  pageMargins: [ 15, 15, 15, 15 ],
  content: [
    { table: tables.secHalf },
  ],
};

fs.writeFile('./pdfs/firstTable.json', JSON.stringify(tables.firstHalf), err => {
  if (err) { console.error(err) }
});

fs.writeFile('./pdfs/secondTable.json', JSON.stringify(tables.secHalf), err => {
  if (err) { console.error(err) }
});

const pdfDoc = pdfmake.createPdfKitDocument(listTableDocs, {});
pdfDoc.pipe(fs.createWriteStream('pdfs/listtable.pdf'));
pdfDoc.end();

// TABLE FUNCTIONS
function makeTable(tableName, year, month){
  // TABLE SETUP
  let allTotalIndex;
  let amountOfColumns;
  let isFisrtHalf;
  let colSpan;
  if(tableName == 'firstHalf'){
    allTotalIndex = 0;
    amountOfColumns = 15;
    isFisrtHalf = true;
    colSpan = 17;
  } else {
    allTotalIndex = 1;
    amountOfColumns = new Date(year, month, 0).getDate() - 15;
    isFisrtHalf = false;
    colSpan = 17;
    // colSpan = amountOfColumns + 3
  }
  console.log('Both Half Total Position: ' + allTotalIndex);
  console.log('Amount of Columns: ' + amountOfColumns);
  console.log('First Half: ' + isFisrtHalf);
  console.log('Column Span: ' + colSpan);
  console.log('\n');

  tables[tableName].widths.push(80);
  tables[tableName].body[0].push(centerBoldGray('Details'));
  for(let count = 0; count < amountOfColumns; count++){
    tables[tableName].widths.push('*');
    if(isFisrtHalf){
      tables[tableName].body[0].push(centerBoldGray(count + 1));
    } else {
      tables[tableName].body[0].push(centerBoldGray(15 + count + 1));
    }
  }
  tables[tableName].widths.push('*');
  tables[tableName].body[0].push(centerBoldGray('Total'));
  // if(isFisrtHalf){
    // tables[tableName].widths.push('*');
    // tables[tableName].body[0].push(centerBoldGray('Grand Total'));
  // }

  const { openingBalance } = cashflow.cashflowObj[0];
  // CASH IN
  tables[tableName].body.push([{
    text: 'CASH IN',
    colSpan,
    fontSize: 5,
    bold: true,
    fillColor: '#b2d3c2',
  }]);

  const { categoryName, position } = insertCategory(tableName, 'openingBalance', openingBalance, centerBold, rightBold);
  const total = (cashflow.bothHalfTotal[categoryName][allTotalIndex]).toFixed(2);
  tables[tableName].body[position].push(rightBold(total));
  // if(isFisrtHalf){
  //   const total = (cashflow.grandTotal[categoryName][0]).toFixed(2);
  //   tables[tableName].body[position].push(rightBold(total));
  // }

  const diffCashIn = ['securityDeposit'];
  insertTypeIn('cashIn', diffCashIn, tableName, allTotalIndex, colSpan, isFisrtHalf);

  tables[tableName].body.push([{
    text: 'CASH OUT',
    colSpan,
    fontSize: 5,
    bold: true,
    fillColor: '#ffa8b5',
  }]);

  const diffCashOut = ['cashOutOther'];
  insertTypeIn('cashOut', diffCashOut, tableName, allTotalIndex, colSpan, isFisrtHalf);

  tables[tableName].body.push([{
    text: 'OTHER BALANCE',
    colSpan,
    fontSize: 5,
    bold: true,
  }]);

  const { float, pettyCash } = cashflow.cashflowObj[0].balance;
  const balanceTotal = cashflow.cashflowObj[allTotalIndex].allTotal.balance;
  const safeBalance = cashflow.cashflowObj[allTotalIndex].allTotal.safeBalance;

  const { position: floatPos } = insertCategory(tableName, 'float', float, centerBold, rightBold);
  const floatTotal = (cashflow.bothHalfTotal.balance.float[allTotalIndex]).toFixed(2);
  tables[tableName].body[floatPos].push(rightBold(floatTotal));
  // if(isFisrtHalf){
  //   const floatGrandTotal = (cashflow.grandTotal.balance.float[0]).toFixed(2);
  //   tables[tableName].body[floatPos].push(rightBold(floatGrandTotal));
  // }

  const { position: pettyCashPos } = insertCategory(tableName, 'pettyCash', pettyCash, centerBold, rightBold);
  const pettyCashTotal = (cashflow.bothHalfTotal.balance.pettyCash[allTotalIndex]).toFixed(2);
  tables[tableName].body[pettyCashPos].push(rightBold(pettyCashTotal));
  // if(isFisrtHalf){
  //   const pettyCashGrandTotal = (cashflow.grandTotal.balance.pettyCash[0]).toFixed(2);
  //   tables[tableName].body[pettyCashPos].push(rightBold(pettyCashGrandTotal));
  // }

  const { position: balanceTotalPos } = insertCategory(tableName, 'TOTAL', balanceTotal, centerBold, rightBold);
  const allBalanceTotal = (cashflow.bothHalfTotal.allTotal.balance[allTotalIndex]).toFixed(2);
  tables[tableName].body[balanceTotalPos].push(rightBold(allBalanceTotal));
  // if(isFisrtHalf){
  //   const allBalanceGrandTotal = (cashflow.grandTotal.allTotal.balance[0]).toFixed(2);
  //   tables[tableName].body[balanceTotalPos].push(rightBold(allBalanceGrandTotal));
  // }

  const { position: safeBalancePos } = insertCategory(tableName, 'Total Safe Balance', safeBalance, centerBoldGray, rightBoldGray);
  const allSafeBalanceTotal = (cashflow.bothHalfTotal.allTotal.safeBalance[allTotalIndex]).toFixed(2);
  tables[tableName].body[safeBalancePos].push(rightBoldGray(allSafeBalanceTotal));
  // if(isFisrtHalf){
  //   const allSafeBalanceGrandTotal = (cashflow.grandTotal.allTotal.safeBalance[0]).toFixed(2);
  //   tables[tableName].body[safeBalancePos].push(rightBoldGray(allSafeBalanceGrandTotal));
  // }
}

function insertTypeIn(cashflowTypeString, diff, tableName, allTotalIndex, colSpan, isFisrtHalf){
  const cashflowType = cashflow.cashflowObj[0][cashflowTypeString];
  for(const type in cashflowType){
    const found = diff.find(element => element == type);
    if(!found){
      tables[tableName].body.push([{
        text: startCase(type),
        colSpan,
        fontSize: 5,
        bold: true,
        fillColor: '#dedede',
      }]);
  
      for(const category in cashflowType[type]){
        const { categoryName, position } = insertCategory(tableName, category, cashflowType[type][category], centerBold, right);
        const categoryTotal = (cashflow.bothHalfTotal[cashflowTypeString][type][categoryName][allTotalIndex]).toFixed(2);
        tables[tableName].body[position].push(rightBold(categoryTotal));
        // if(isFisrtHalf){
        //   const categoryGrandTotal = (cashflow.grandTotal[cashflowTypeString][type][categoryName][0]).toFixed(2);
        //   tables[tableName].body[position].push(rightBold(categoryGrandTotal));
        // }
      }
  
      const total = cashflow.cashflowObj[0].allTotal[type];
      const { categoryName, position } = insertCategory(tableName, 'TOTAL', total, centerBold, rightBold);
      const categoryTotal = (cashflow.bothHalfTotal.allTotal[type][allTotalIndex]).toFixed(2);
      tables[tableName].body[position].push(rightBold(categoryTotal));
      if(isFisrtHalf){
        const categoryGrandTotal = (cashflow.grandTotal.allTotal[type][0]).toFixed(2);
        tables[tableName].body[position].push(rightBold(categoryGrandTotal));
      }
    }
  }

  diff.forEach(typeString => {
    const type = cashflowType[typeString];
    for(const category in type){
      const { categoryName, position } = insertCategory(tableName, category, type[category], centerBold, right);
      const categoryTotal = (cashflow.bothHalfTotal[cashflowTypeString][typeString][categoryName][allTotalIndex]).toFixed(2);
      tables[tableName].body[position].push(rightBold(categoryTotal));
      // if(isFisrtHalf){
      //   const categoryGrandTotal = (cashflow.grandTotal[cashflowTypeString][typeString][categoryName][0]).toFixed(2);
      //   tables[tableName].body[position].push(rightBold(categoryGrandTotal));
      // }
    }
  });
}

function insertCategory(table, categoryName, values, categoryStyle, valueStyle){
  const stcaseCategory = startCase(categoryName);
  const position = tables[table].body.length;

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