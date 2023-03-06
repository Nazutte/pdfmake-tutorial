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

  const tables = {
    branchReport: {
      headerRows: 2,
      widths: ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*'],
      body: [
        [
          { text: 'Branch', alignment: 'center', rowSpan: 2, fontSize, bold },
          { text: 'Opening Balance', alignment: 'center', rowSpan: 2, fontSize, bold },
          { text: 'Cash In', alignment: 'center', colSpan: 7, fontSize, bold },
          {},
          {},
          {},
          {},
          {},
          {},
          { text: 'Cash Out', alignment: 'center', colSpan: 11, fontSize, bold },
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
          { text: 'Closing Balance', alignment: 'center', rowSpan: 2, fontSize, bold },
          { text: 'Other Balance', alignment: 'center', colSpan: 2, fontSize, bold },
          {},
        ],
        [
          {},
          {},
          { text: 'Electric', alignment: 'center', fontSize, bold },
          { text: 'Water', alignment: 'center', fontSize, bold },
          { text: 'Sewerage', alignment: 'center', fontSize, bold },
          { text: 'Other Income', alignment: 'center', fontSize, bold },
          { text: 'Ice', alignment: 'center', fontSize, bold },
          { text: 'Security Deposit', alignment: 'center', fontSize, bold },
          { text: 'Total', alignment: 'center', fontSize, bold },
  
          { text: 'Cash Deposit', alignment: 'center', fontSize, bold },
          { text: 'Security Deposit', alignment: 'center', fontSize, bold },
          { text: 'ATM Deposit', alignment: 'center', fontSize, bold },
          { text: 'Online', alignment: 'center', fontSize, bold },
          { text: 'Cash Agent', alignment: 'center', fontSize, bold },
          { text: 'Cheque Deposit', alignment: 'center', fontSize, bold },
          { text: 'Card Collection', alignment: 'center', fontSize, bold },
          { text: 'Direct Transfer', alignment: 'center', fontSize, bold },
          { text: 'Payments', alignment: 'center', fontSize, bold },
          { text: 'Settlement', alignment: 'center', fontSize, bold },
          { text: 'Total', alignment: 'center', fontSize, bold },
          {},
          { text: 'Float', alignment: 'center', fontSize, bold },
          { text: 'Petty Cash', alignment: 'center', fontSize, bold },
        ],
      ],
    },
  }

  module.exports = sampleTable