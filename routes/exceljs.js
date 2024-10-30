const router = require('express').Router();

const s3Controller = require('../controllers/exceljs');

router.get('/get-singlesheet-data-stream', s3Controller.getExcelSheetAsStream);

router.get('/get-singlesheet-data-buffer', s3Controller.getExcelSheetAsBuffer);

router.get('/get-multiSheet-data-buffer', s3Controller.getExcelSheetsAsBuffer);

router.get('/get-multiSheet-data-stream', s3Controller.getExcelSheetsAsStream);

router.get('/get-presigned-url', s3Controller.getPresignedUrl);

module.exports = router;


