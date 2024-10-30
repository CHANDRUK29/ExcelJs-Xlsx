const { getDocumentFromUrl } = require('./awsS3')
const ExcelJs = require('exceljs');


const readSingleSheetFromExcelAsStream = async (url) => {
  try {
    const jsonData = [];
    const data = await getDocumentFromUrl(url);
    const workbook = new ExcelJs.Workbook();

    await workbook.xlsx.read(data);

    const worksheet = workbook.worksheets[0];
    const headers = worksheet.getRow(1).values;

    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      if (rowNumber > 1) {
        const rowData = {};
        headers.forEach((val, index) => {
          if (val) {
            rowData[val] = (row.getCell(index).value === 'NULL') ? null : row.getCell(index).value;
          }
        });
        jsonData.push(rowData);
      }
    });

    return jsonData;
  } catch (error) {
    console.error('Error reading Excel file from stream:', error);
    throw error;
  }
};


const readSingleSheetFromExcelAsBuffer = (url) => {
  return new Promise((resolve, reject) => {
    getDocumentFromUrl(url)
      .then((data) => {
        const chunks = [];

        data.on('data', (chunk) => {
          chunks.push(chunk);
        });

        data.on('end', () => {
          const buffer = Buffer.concat(chunks);
          const workbook = new ExcelJs.Workbook();
          
          workbook.xlsx.load(buffer)
            .then(() => {
              const worksheet = workbook.worksheets[0];
              const jsonData = [];
              const headers = worksheet.getRow(1).values;

              worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                if (rowNumber > 1) {
                  const rowData = {};
                  headers.forEach((header, index) => {
                    if (header) {
                      rowData[header] = row.getCell(index).value === 'NULL' ? null : row.getCell(index).value;
                    }
                  });
                  jsonData.push(rowData);
                }
              });

              resolve(jsonData);
            })
            .catch((err) => {
              reject(err);
            });
        });

        data.on('error', (err) => {
          console.error('Stream error:', err);
          reject(err);
        });
      })
      .catch((error) => {
        console.error('Error reading Excel file from S3 URL (buffer):', error);
        reject(error);
      });
  });
};



const readMultipleSheetsFromExcelAsBuffer = (url) => {
  return new Promise((resolve, reject) => {
    getDocumentFromUrl(url).then((data) => {
        const chunks = [];

        data.on('data', (chunk) => {
          chunks.push(chunk);
        });

        data.on('end', async () => {
          try {
            const buffer = Buffer.concat(chunks);
            const workbook = new ExcelJs.Workbook();
            await workbook.xlsx.load(buffer);
            const allSheetsData = {};

            workbook.worksheets.forEach((worksheet) => {
              const jsonData = [];
              const headers = worksheet.getRow(1).values;

              worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                if (rowNumber > 1) {
                  const rowData = {};
                  headers.forEach((header, index) => {
                    if (header) {
                      rowData[header] = row.getCell(index).value === 'NULL' ? null : row.getCell(index).value;
                    }
                  });
                  jsonData.push(rowData);
                }
              });
              allSheetsData[worksheet.name] = jsonData;
            });

            resolve(allSheetsData);
          } catch (err) {
            reject(err);
          }
        });

        data.on('error', (err) => {
          logger.error('Stream error:', err);
          reject(err);
        });
      })
      .catch((error) => {
        logger.error('Error reading Excel file from S3 URL (buffer):', error);
        reject(error);
      });
  });
};


const readMultipleSheetsFromExcelAsStream = async (url) => {
  try {
    const data = await getDocumentFromUrl(url);
    const workbook = new ExcelJs.Workbook();
    await workbook.xlsx.read(data)
    const allSheetData = {};

    workbook.worksheets.forEach((worksheet) => {
      const sheetName = worksheet.name;
      const jsonData = [];
      const headers = worksheet.getRow(1).values;

      worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        if (rowNumber > 1) {
          const rowData = {};
          headers.forEach((header, index) => {
            if (header) {
              const cellValue = row.getCell(index).value;
              rowData[header] = (cellValue === 'NULL') ? null : cellValue;
            }
          });
          jsonData.push(rowData);
        }
      });

      allSheetData[sheetName] = jsonData;
    });

    return allSheetData;

  } catch (error) {
    console.error('Error reading Excel file from stream:', error);
    throw error;
  }
}

module.exports = {
  readSingleSheetFromExcelAsStream,
  readSingleSheetFromExcelAsBuffer,
  readMultipleSheetsFromExcelAsStream,
  readMultipleSheetsFromExcelAsBuffer
}