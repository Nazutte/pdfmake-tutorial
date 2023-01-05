const sampleStyles = {
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

const sampleTable = {
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