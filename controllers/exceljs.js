const { getDocumentFromUrl, getDocumentUploadUrl } = require("../services/awsS3")
const { readSingleSheetFromExcelAsBuffer, readSingleSheetFromExcelAsStream,
  readMultipleSheetsFromExcelAsBuffer, readMultipleSheetsFromExcelAsStream } = require('../services/exceljs');
const { s3Config } = require('../config/aws.config');

const getPresignedUrl = async (req, res) => {
  try {
    let fileClassification;
    const validClassification = ['student', 'parent'];
    if (!validClassification.includes(req.query?.classfication)) {
      warn = `Invalid/Unknown classification. File will be uploaded under "general" path. Known classification: ${validClassification.join(',')}`;
    }
    switch (req.query.classfication) {
      case 'student':
        fileClassification = s3Config.BASE_PATHS.student;
        break;

      case 'parent':
        fileClassification = s3Config.BASE_PATHS.father;
        break;

      default:
        fileClassification = s3Config.BASE_PATHS.fallbackPath;
        break;
    }
    const url = await getDocumentUploadUrl(fileClassification, req.query.extension, req.query.contentType, req.query.fileName);
    return res.status(200).json({ message: 'URL generated successfully', presignedUrl: url });
  } catch (error) {
    return res.status().json({ error: "internal server error", errorDescription: error.message });
  }
};




const getExcelSheetAsStream = async (req, res) => {
  try {
    const data = await readSingleSheetFromExcelAsStream(`${s3Config.BUCKET_URL}/general/students.xlsx`)
    if (data) return res.status(200).json({ message: 'data fetched successfully', data })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'interal server error', errorDescription: error.message })
  }
}


const getExcelSheetAsBuffer = async (req, res) => {
  try {
    const data = await readSingleSheetFromExcelAsBuffer(`${s3Config.BUCKET_URL}/general/students.xlsx`);
    if (data) return res.status(200).json({ message: 'data fetched successfully', data })

  } catch (error) {
    console.error('Error reading Excel file from S3 URL (buffer):', error);
  }
}



const getExcelSheetsAsBuffer = async (req, res) => {
  try {
    const data = await readMultipleSheetsFromExcelAsBuffer(`${s3Config.BUCKET_URL}/general/parentStudent.xlsx`);
    if (data) return res.status(200).json({ message: 'data fetched successfully', data })
  } catch (error) {
    console.error('Error reading Excel file from S3 URL (buffer):', error);
  }
}

const getExcelSheetsAsStream = async (req, res) => {
  try {
    const data = await readMultipleSheetsFromExcelAsStream(`${s3Config.BUCKET_URL}/general/parentStudent.xlsx`);
    if (data) return res.status(200).json({ message: 'data fetched successfully', data })
  } catch (error) {
    console.error('Error reading Excel file from S3 URL (buffer):', error);
  }
}



module.exports = {
  getExcelSheetAsStream,
  getExcelSheetAsBuffer,
  getExcelSheetsAsBuffer,
  getExcelSheetsAsStream,
  getPresignedUrl
}