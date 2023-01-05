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

let table1 = {
  headerRows: 1,
  widths: [],
  body: [
    [],
    [{ text: 'CASH IN', colSpan: 17, fontSize: 7, bold: true }],
  ],
};

table1.widths.push(80);
table1.body[0].push({ text: 'Details', alignment: 'center', fontSize: 6, bold: true, fillColor: '#dedede' });
for(let count = 0; count < 15; count++){
  table1.widths.push('*');
  table1.body[0].push({ text: count + 1, alignment: 'center', fontSize: 6, bold: true, fillColor: '#dedede' });
}
table1.widths.push('*');
table1.body[0].push({ text: 'Total', alignment: 'center', fontSize: 6, bold: true, fillColor: '#dedede' });

let listTableDocs = {
  pageSize: 'A4',
  pageOrientation: 'landscape',
  content: [
    { table: table1 },
  ],
};

const pdfDoc = pdfmake.createPdfKitDocument(listTableDocs, {});
pdfDoc.pipe(fs.createWriteStream('pdfs/listtable.pdf'));
pdfDoc.end();