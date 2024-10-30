const XLSX = require('xlsx');

const { XlsxFileUnavailableError, XlsxNoFilePathError, XlsxUnknownError, XlsxNoBufferError } = require('../utils/customErrors');

const getSingleSheetDataFromFile = (filepath) => {
  if (!filepath) {
    throw new XlsxNoFilePathError('Filepath is missing');
  }
  try {
    const workbookData = XLSX.readFile(filepath);
    const jsonData = XLSX.utils.sheet_to_json(workbookData.Sheets[workbookData.SheetNames[0]]);
    return jsonData;
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new XlsxFileUnavailableError('File Not Found');
    }
    throw new XlsxUnknownError('Something went wrong', error);
  }
};

const getAllSheetDataFromFile = (filepath) => {
  if (!filepath) {
    throw new XlsxNoFilePathError('Filepath is missing');
  }
  try {
    const jsonData = [];
    const workbookData = XLSX.readFile(filepath);
    for (let i = 0; i < workbookData.SheetNames.length; i += 1) {
      jsonData.push(XLSX.utils.sheet_to_json(workbookData.Sheets[workbookData.SheetNames[i]]));
    }
    return jsonData;
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new XlsxFileUnavailableError('File Not Found');
    }
    throw new XlsxUnknownError('Something went wrong', error);
  }
};

const getSingleSheetDataFromBuffer = (buffer) => {
  if (!buffer) {
    throw new XlsxNoBufferError('No Buffer available');
  }
  if (!Buffer.isBuffer(buffer)) {
    throw new XlsxNoBufferError('Invalid Buffer given');
  }
  try {
    const workbookData = XLSX.read(buffer);
    const jsonData = XLSX.utils.sheet_to_json(workbookData.Sheets[workbookData.SheetNames[0]]);
    return jsonData;
  } catch (error) {
    throw new XlsxUnknownError('Something went wrong', error);
  }
};

const getAllSheetDataFromBuffer = (buffer) => {
  if (!buffer) {
    throw new XlsxNoBufferError('No Buffer available');
  }
  if (!Buffer.isBuffer(buffer)) {
    throw new XlsxNoBufferError('Invalid Buffer given');
  }
  try {
    const jsonData = [];
    const workbookData = XLSX.read(buffer);
    for (let i = 0; i < workbookData.SheetNames.length; i += 1) {
      jsonData.push(XLSX.utils.sheet_to_json(workbookData.Sheets[workbookData.SheetNames[i]]));
    }
    return jsonData;
  } catch (error) {
    throw new XlsxUnknownError('Something went wrong', error);
  }
};

const getSingleSheetDataFromStream = async (stream) => {
  try {
    return new Promise((resolve, reject) => {
      const buffers = [];
      stream.on('data', (d) => buffers.push(d));
      stream.on('end', () => {
        const buffer = Buffer.concat(buffers);
        const workbookData = XLSX.read(buffer);
        const jsonData = XLSX.utils.sheet_to_json(workbookData.Sheets[workbookData.SheetNames[0]]);
        resolve(jsonData);
      });
      stream.on('error', (e) => {
        reject(e);
      });
    });
  } catch (error) {
    throw new XlsxUnknownError('Something went wrong', error);
  }
};

const getMultipleSheetDataFromStream = async (stream) => {
  try {
    return new Promise((resolve, reject) => {
      const buffers = [];
      stream.on('data', (d) => buffers.push(d));
      stream.on('end', () => {
        const jsonData = [];
        const buffer = Buffer.concat(buffers);
        const workbookData = XLSX.read(buffer);
        for (let i = 0; i < workbookData.SheetNames.length; i += 1) {
          jsonData.push(XLSX.utils.sheet_to_json(workbookData.Sheets[workbookData.SheetNames[i]]));
        }
        resolve(jsonData);
      });
      stream.on('error', (e) => {
        reject(e);
      });
    });
  } catch (error) {
    throw new XlsxUnknownError('Something went wrong', error);
  }
};

module.exports = {
  getSingleSheetDataFromFile,
  getAllSheetDataFromFile,
  getSingleSheetDataFromBuffer,
  getAllSheetDataFromBuffer,
  getSingleSheetDataFromStream,
  getMultipleSheetDataFromStream,
};
