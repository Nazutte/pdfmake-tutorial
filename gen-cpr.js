const { centerBoldGray, centerBold, rightBoldGray, rightBold, right } = require('./styles')
const { startCase } = require('lodash')
const fs = require('fs')
const Pdfmake = require('pdfmake')

function main(){
  const cashflow = require('./resources/cashflow-obj.json');

  const fonts = {
    Roboto: {
      normal: 'fonts/Roboto-Regular.ttf',
      bold: 'fonts/Roboto-Medium.ttf',
      italics: 'fonts/Roboto-Italic.ttf',
      bolditalics: 'fonts/Roboto-MediumItalic.ttf',
    }
  };
  
  const pdfmake = new Pdfmake(fonts);
  
  const tables = getTable(cashflow);
  
  let listTableDocs = {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [ 15, 15, 15, 15 ],
    content: [
      { table: tables.firstHalf, pageBreak: 'after'},
      { table: tables.secHalf },
    ],
  };
  
  const pdfDoc = pdfmake.createPdfKitDocument(listTableDocs, {});
  pdfDoc.pipe(fs.createWriteStream('pdfs/cashflow.pdf'));
  pdfDoc.end();
}

main();

// TABLE FUNCTIONS
function getTable(cashflow){
  let tables = {
    firstHalf: makeCashflowTable(cashflow, 'firstHalf', 2022, 10),
    secHalf: makeCashflowTable(cashflow, 'secHalf', 2022, 10),
  };

  return tables;
}

function makeCashflowTable(cashflow, tableName, year, month){
  // TABLE SETUP
  let allTotalIndex;
  let amountOfColumns;
  let isFirstHalf;
  let colSpan;

  const table = {
    headerRows: 1,
    widths: [],
    body: [[]],
  };

  if(tableName == 'firstHalf'){
    allTotalIndex = 0;
    amountOfColumns = 15;
    isFirstHalf = true;
    colSpan = 17;
  } else {
    allTotalIndex = 1;
    amountOfColumns = cashflow.generalInfo.days - 15;
    isFirstHalf = false;
    colSpan = amountOfColumns + 3
  }

  table.widths.push(80);
  table.body[0].push(centerBoldGray('Details'));
  for(let count = 0; count < amountOfColumns; count++){
    table.widths.push('*');
    if(isFirstHalf == true){
      table.body[0].push(centerBoldGray(count + 1));
    } else {
      table.body[0].push(centerBoldGray(15 + count + 1));
    }
  }
  table.widths.push('*');
  table.body[0].push(centerBoldGray('Total'));
  if(isFirstHalf == false){
    table.widths.push('*');
    table.body[0].push(centerBoldGray('Grand Total'));
  }

  const { openingBalance, closingBalance } = cashflow.cashflowObj[allTotalIndex];
  // CASH IN
  table.body.push([{
    text: 'CASH IN',
    colSpan,
    fontSize: 5,
    bold: true,
    fillColor: '#b2d3c2',
  }]);

  const { categoryName, position } = insertCategory('openingBalance', openingBalance, centerBold, rightBold);
  table.body[position].push('');
  if(isFirstHalf == false){
    table.body[position].push('');
  }

  const diffCashIn = ['securityDeposit'];
  insertTypeIn('cashIn', diffCashIn);

  // CASH OUT
  table.body.push([{
    text: 'CASH OUT',
    colSpan,
    fontSize: 5,
    bold: true,
    fillColor: '#ffa8b5',
  }]);

  const diffCashOut = ['cashOutOther'];
  insertTypeIn('cashOut', diffCashOut);

  const { position: coutPos } = insertCategory('closingBalance', closingBalance, centerBold, rightBold);
  table.body[coutPos].push('');
  if(isFirstHalf == false){
    table.body[coutPos].push('');
  }

  // OTHER BALANCES
  table.body.push([{
    text: 'OTHER BALANCE',
    colSpan,
    fontSize: 5,
    bold: true,
  }]);

  const { float, pettyCash } = cashflow.cashflowObj[allTotalIndex].balance;
  const balanceTotal = cashflow.cashflowObj[allTotalIndex].allTotal.balance;
  const safeBalance = cashflow.cashflowObj[allTotalIndex].allTotal.safeBalance;

  const { position: floatPos } = insertCategory('float', float, centerBold, rightBold);
  table.body[floatPos].push('');
  if(isFirstHalf == false){
    table.body[floatPos].push('');
  }

  const { position: pettyCashPos } = insertCategory('pettyCash', pettyCash, centerBold, rightBold);
  table.body[pettyCashPos].push('');
  if(isFirstHalf == false){
    table.body[pettyCashPos].push('');
  }

  const { position: balanceTotalPos } = insertCategory('TOTAL', balanceTotal, centerBold, rightBold);
  table.body[balanceTotalPos].push('');
  if(isFirstHalf == false){
    table.body[balanceTotalPos].push('');
  }

  const { position: safeBalancePos } = insertCategory('Total Safe Balance', safeBalance, centerBoldGray, rightBoldGray);
  table.body[safeBalancePos].push(rightBoldGray(''));
  if(isFirstHalf == false){
    table.body[safeBalancePos].push(rightBoldGray(''));
  }

  return table;

  function insertTypeIn(cashflowTypeString, diff){
    const cashflowType = cashflow.cashflowObj[allTotalIndex][cashflowTypeString];
    for(const type in cashflowType){
      const found = diff.find(element => element == type);
      if(!found){
        table.body.push([{
          text: startCase(type),
          colSpan,
          fontSize: 5,
          bold: true,
          fillColor: '#dedede',
        }]);
    
        for(const category in cashflowType[type]){
          const { categoryName, position } = insertCategory(category, cashflowType[type][category], centerBold, right, amountOfColumns);
          const categoryTotal = (cashflow.bothHalfTotal[cashflowTypeString][type][categoryName][allTotalIndex] / 100).toFixed(2);
          table.body[position].push(rightBold(categoryTotal));
          if(isFirstHalf == false){
            const categoryGrandTotal = (cashflow.grandTotal[cashflowTypeString][type][categoryName][0] / 100).toFixed(2);
            table.body[position].push(rightBold(categoryGrandTotal));
          }
        }
    
        const total = cashflow.cashflowObj[allTotalIndex].allTotal[type];
        const { categoryName, position } = insertCategory('TOTAL', total, centerBold, rightBold, amountOfColumns);
        const categoryTotal = (cashflow.bothHalfTotal.allTotal[type][allTotalIndex] / 100).toFixed(2);
        table.body[position].push(rightBold(categoryTotal));
        if(isFirstHalf == false){
          const categoryGrandTotal = (cashflow.grandTotal.allTotal[type][0] / 100).toFixed(2);
          table.body[position].push(rightBold(categoryGrandTotal));
        }
      }
    }
  
    diff.forEach(typeString => {
      const type = cashflowType[typeString];
      for(const category in type){
        const { categoryName, position } = insertCategory(category, type[category], centerBold, right, amountOfColumns);
        const categoryTotal = (cashflow.bothHalfTotal[cashflowTypeString][typeString][categoryName][allTotalIndex] / 100).toFixed(2);
        table.body[position].push(rightBold(categoryTotal));
        if(isFirstHalf == false){
          const categoryGrandTotal = (cashflow.grandTotal[cashflowTypeString][typeString][categoryName][0] / 100).toFixed(2);
          table.body[position].push(rightBold(categoryGrandTotal));
        }
      }
    });
  
    const cashflowTypeTotal = cashflow.cashflowObj[allTotalIndex].allTotal[cashflowTypeString];
    const { categoryName, position } = insertCategory((cashflowTypeString + 'Total'), cashflowTypeTotal, centerBoldGray, rightBoldGray, amountOfColumns);
    const categoryTotal = (cashflow.bothHalfTotal.allTotal[cashflowTypeString][allTotalIndex] / 100).toFixed(2);
    table.body[position].push(rightBoldGray(categoryTotal));
    if(isFirstHalf == false){
      const categoryGrandTotal = (cashflow.grandTotal.allTotal[cashflowTypeString][0] / 100).toFixed(2);
      table.body[position].push(rightBoldGray(categoryGrandTotal));
    }
  }

  function insertCategory(categoryName, values, categoryStyle, valueStyle){
    const stcaseCategory = startCase(categoryName);
    const position = table.body.length;
  
    table.body.push([]);
    table.body[position].push(categoryStyle(stcaseCategory));
    for(let count = 0; count < amountOfColumns; count++){
      let value = values[count];
      if(typeof value != 'number'){
        if(value.amount){
          value = value.amount;
        } else {
          value = 0;
        }
      }
      value = (value / 100).toFixed(2);
      table.body[position].push(valueStyle(value));
    }
  
    return { categoryName, position };
  }
}