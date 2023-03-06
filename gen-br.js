const { centerBoldGray, centerBold, rightBoldGray, rightBold, right } = require('./styles')
const { startCase } = require('lodash')
const branchData = require('./resources/branch-report.json')
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

  const branchReport = createBranchReport();

  const listTableDocs = {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [ 15, 15, 15, 15 ],
    content: [ 
      {table: branchReport},
    ],
  };

  const pdfDoc = pdfmake.createPdfKitDocument(listTableDocs, {});
  pdfDoc.pipe(fs.createWriteStream('pdfs/branch-report.pdf'));
  pdfDoc.end();
}

main();

// FUNCTIONS
function createBranchReport(){
  let rowCount = 1;
  const format = branchData.branch[0].record;

  const branchReport = {
    headerRows: 2,
    widths: [],
    body: [],
  }

  createFormat();

  function createFormat(){
    insert('Branch', 2);
    // insert('Opening Balance', 2);
  }

  function insert(value, rowSpan){
    if(branchReport.body.length < rowCount){
      branchReport.widths.push('*');
      branchReport.body.push([]);
    }

    if(rowSpan > 1){
      for(let i = 1; i < rowSpan; i++){
        branchReport.body.push([]);
        branchReport.body[(rowCount - 1) + i].push({});
      }
    }

    const obj = {
      text: value,
      rowSpan,
    }

    branchReport.body[rowCount - 1].push(obj);
  }

  console.log(branchReport.widths);
  console.log(branchReport.body);

  return branchReport;
}