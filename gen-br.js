const { centerBoldGray, centerBold, rightBoldGray, rightBold, right } = require('./styles')
const { startCase } = require('lodash')
const branchData = require('./resources/cashflow-obj.json')
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

const fontSize = 5.4;

const tables = {
  branchReport: {
    headerRows: 2,
    widths: ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*'],
    body: [
      [
        { text: 'Branch', alignment: 'center', rowSpan: 2, fontSize },
        { text: 'Opening Balance', alignment: 'center', rowSpan: 2, fontSize },
        { text: 'Cash In', alignment: 'center', colSpan: 7, fontSize },
        {},
        {},
        {},
        {},
        {},
        {},
        { text: 'Cash Out', alignment: 'center', colSpan: 11, fontSize },
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        { text: 'Closing Balance', alignment: 'center', rowSpan: 2, fontSize },
        { text: 'Other Balance', alignment: 'center', colSpan: 2, fontSize },
        {},
      ],
      [
        {},
        {},
        { text: 'Electric', alignment: 'center', fontSize },
        { text: 'Water', alignment: 'center', fontSize },
        { text: 'Sewerage', alignment: 'center', fontSize },
        { text: 'Other Income', alignment: 'center', fontSize },
        { text: 'Ice', alignment: 'center', fontSize },
        { text: 'Security Deposit', alignment: 'center', fontSize },
        { text: 'Total', alignment: 'center', fontSize },

        { text: 'Cash Deposit', alignment: 'center', fontSize },
        { text: 'Security Deposit', alignment: 'center', fontSize },
        { text: 'ATM Deposit', alignment: 'center', fontSize },
        { text: 'Online', alignment: 'center', fontSize },
        { text: 'Cash Agent', alignment: 'center', fontSize },
        { text: 'Cheque Deposit', alignment: 'center', fontSize },
        { text: 'Card Collection', alignment: 'center', fontSize },
        { text: 'Direct Transfer', alignment: 'center', fontSize },
        { text: 'Payments', alignment: 'center', fontSize },
        { text: 'Settlement', alignment: 'center', fontSize },
        { text: 'Total', alignment: 'center', fontSize },
        {},
        { text: 'Float', alignment: 'center', fontSize },
        { text: 'Petty Cash', alignment: 'center', fontSize },
      ],
    ],
  },
}

const listTableDocs = {
  pageSize: 'A4',
  pageOrientation: 'landscape',
  pageMargins: [ 15, 15, 15, 15 ],
  content: [ 
    {table: tables.branchReport},
  ],
};

const pdfDoc = pdfmake.createPdfKitDocument(listTableDocs, {});
pdfDoc.pipe(fs.createWriteStream('pdfs/branch-report.pdf'));
pdfDoc.end();