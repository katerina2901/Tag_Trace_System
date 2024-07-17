const XLSX = require('xlsx');

exports.readExcelFile = (SKU) => {
  const workbook = XLSX.readFile('path_to_excel_file.xlsx');
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);

  const product = data.find((row) => row.SKU === SKU);
  return product ? product.Description : 'Description not found';
};
