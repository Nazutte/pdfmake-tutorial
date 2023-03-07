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
  let rowCount = 0;
  const format = branchData.branch[0].record;

  const branchReport = {
    headerRows: 2,
    widths: [],
    body: [],
  }

  createFormat();

  console.log(branchReport.widths);
  console.log(branchReport.body);
  
  return branchReport;

  // --------------------------------------------------------
  function createFormat(){
    const { cashInRecord, cashOutRecord, other } = format;

    incrementRowCount(2);
    insert('Branch', [], false);
    insert('Opening Balance', [], false);
    insert('Cash In', getCategory(cashInRecord), false);
    insert('Cash Out', getCategory(cashOutRecord), false);
    insert('Closing Balance', [], false);
    insert('Other Balance', getCategory(other), true);
  }

  function insert(value, subValues, diff){
    const obj = {
      text: startCase(value),
      fontSize: 5.4,
      bold: true,
      alignment: 'center',
    }
    
    if(subValues.length){
      if(!diff){
        subValues.push('Total');
      }

      Object.assign(obj, { colSpan: subValues.length });
    } else {
      Object.assign(obj, { rowSpan: 2 });
    }

    branchReport.widths.push('*');

    if(obj.colSpan){
      branchReport.body[rowCount - 2].push(obj);

      for(let i = 0; i < obj.colSpan - 1; i++){
        branchReport.widths.push('*');
        branchReport.body[rowCount - 2].push({});
      }

      for(let i = 0; i < obj.colSpan; i++){
        const subObj = {
          text: startCase(subValues[i]),
          fontSize: 5.4,
          bold: true,
          alignment: 'center',
        }

        branchReport.body[rowCount - 1].push(subObj);
      }
    } else if(obj.rowSpan){
      branchReport.body[rowCount - 2].push(obj);
      branchReport.body[rowCount - 1].push({});
    }
  }

  function getCategory(type){
    let categoryArr = [];
    for(const category in type){
      categoryArr.push(category);
    }
    return categoryArr;
  }

  function incrementRowCount(byValue){
    rowCount += byValue;

    for(let i = 0; i < byValue; i++){
      branchReport.body.push([]); 
    }
  }
  // --------------------------------------------------------
}