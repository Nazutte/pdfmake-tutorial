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

const styles = {
  header: {
    fontSize: 18,
    bold: true,
    alignment: 'center',
    margin: [0, 30, 0, 20]
  },
  subheader: {
    fontSize: 14,
    margin: [0, 15, 0, 10],
    color: '#003893',
  },
  text: {
    alignment: 'justify'
  },
  link: {
    decoration: 'underline',
    color: '#0074c1'
  }
};

const table = {
  headerRows: 3,
  widths: ['*', 'auto', 100, 60, 50, 60, 50],

  body: [[
    {
      text: 'Name',
      rowSpan: 3
    },
    {
      text: 'Age',
      rowSpan: 3
    },
    {
      text: 'Gender',
      rowSpan: 3
    },
    {
      text: 'Mark',
      alignment: 'center',
      colSpan: 4
    },
    {},
    {},
    {},
  ],
  [
    {},
    {},
    {}, 
    {
      text: 'First Year',
      alignment: 'center',
      colSpan: 2
    },
    {},
    {
      text: 'Second year',
      alignment: 'center',
      colSpan: 2
    },
    {},
  ],
  [
    {},
    {},
    {},
    {
      text: 'Theory',
    },
    {
      text: 'Practical'
    },
    {
      text: 'Theory',
    },
    {
      text: 'Practical',
    }
  ],
  ['Ram', '32', 'Male', '90', '95', '80', '95'],
  ['Sita', '30', 'Female', '95', '95', '80', '95'],
  ['Laxman', '26', 'Male', '70', '90', '75', '90'],
]};

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