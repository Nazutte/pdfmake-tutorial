const { centerBoldGray, centerBold, rightBoldGray, rightBold, right } = require('./styles')
const { startCase } = require('lodash')
const fs = require('fs')
const Pdfmake = require('pdfmake')

function main(){
  const fonts = {
    Roboto: {
      normal: 'fonts/Roboto-Regular.ttf',
      bold: 'fonts/Roboto-Medium.ttf',
      italics: 'fonts/Roboto-Italic.ttf',
      bolditalics: 'fonts/Roboto-MediumItalic.ttf',
    }
  };
  
  const pdfmake = new Pdfmake(fonts);

  const closingData = require('./resources/closing-report.json')
  const table = createClosingReport(closingData);
  
  let listTableDocs = {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [ 15, 15, 15, 15 ],
    content: [{ table }],
  };

  const pdfDoc = pdfmake.createPdfKitDocument(listTableDocs, {});
  pdfDoc.pipe(fs.createWriteStream('pdfs/closing-report.pdf'));
  pdfDoc.end();
}

main();

// FUNCTIONS
function createClosingReport(closingData){
  let table = {
    headerRows: 1,
    widths: [],
    body: [],
  }

  const amountOfColumns = closingData.generalInfo.days;

  for(let i = 0; i < amountOfColumns + 1; i++){
    table.widths.push('*');
  }

  const days = Array.from({length: amountOfColumns}, (_, i) => i + 1);
  valueFormatter('branches', days, centerBoldGray);

  closingData.branchArr.forEach(branch => {
    const { name, dailyRecord } = branch;
    valueFormatter(name, dailyRecord, right);
  });

  const { dailyTotal } = closingData;
  valueFormatter('Total', dailyTotal, rightBold);

  return table;

  function valueFormatter(detail, values, style){
    const formattedValues = [centerBoldGray(detail)];

    values.forEach(value => {
      if(detail == 'branches'){
        formattedValues.push(style(value));
      } else {
        value = (value / 100).toFixed(2);
        formattedValues.push(style(value));
      }
    });

    table.body.push(formattedValues);
  }
}