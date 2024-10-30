const ExcelJS = require('exceljs');
const data = [
  "sessionId",
  "admissionNumber",
  "rollNumber",
  "studentPhoto",
  "firstName",
  "lastName",
  "dateOfBirth",
  "caste",
  "email",
  "mobileNumber",
  "admissionDate",
  "height",
  "weight",
  "medicalHistory",
  "primary",
  "fatherName",
  "fatherEmail",
  "fatherPhone",
  "fatherOccupation",
  "fatherProfile",
  "motherName",
  "motherEmail",
  "motherPhone",
  "motherOccupation",
  "motherProfile",
  "guardianName",
  "guardianRelation",
  "guardianEmail",
  "guardianPhone",
  "guardianOccupation",
  "guardianProfile",
  "classId",
  "sectionId",
  "schoolDivisionId",
  "genderId",
  "religionId",
  "categoryId",
  "houseId",
  "bloodGroupId"
]

const dropdownOptions = {
  bloodGroupId: ['5-A+ve', '7-AB+ve', '8-AB-ve', '6-B+ve', '9-O+ve'],
  sectionId: [
    '23-A', '24-B',
    '25-C', '26-D',
    '27-E', '28-F',
    '29-G', '30-H',
    '31-I', '32-J'
  ],
  classId: [
    '33-I', '34-II',
    '35-III', '36-IV',
    '41-IX', '37-V',
    '38-VI', '39-VII',
    '40-VIII', '42-X',
    '43-XI', '44-XII'
  ],
  genderId: ['107-Female', '106-Male', '108-Others'],
  schoolDivisionId: [
    '113-Central Division',
    '110-East Division',
    '92-High Seceondary School',
    '109-North Division',
    '90-Primary School',
    '91-Secondary School',
    '112-South Division',
    '111-West Division'
  ],
  religionId: [
    '117-Buddhism',
    '115-Christianity',
    '116-Hinduism',
    '114-Islam',
    '118-Jainism'
  ],
  categoryId: ['119-BC', '121-BCM', '120-MBC', '122-OC', '123-ST'],
  houseId: ['128-Black', '126-Blue', '127-Green', '124-Red', '125-Yellow'],
  sessionId: [
    '1-Academic Year 1999-2000',
    '2-Academic Year 2000-2001',
    '3-Academic Year 2001-2002',
    '4-Academic Year 2002-2003',
    '5-Academic Year 2003-2004',
    '6-Academic Year 2004-2005',
    '7-Academic Year 2005-2006',
    '8-Academic Year 2006-2007',
    '9-Academic Year 2007-2008',
    '10-Academic Year 2008-2009',
    '11-Academic Year 2009-2010',
    '12-Academic Year 2010-2011',
    '13-Academic Year 2011-2012',
    '14-Academic Year 2012-2013',
    '15-Academic Year 2013-2014',
    '16-Academic Year 2014-2015',
    '17-Academic Year 2015-2016',
    '18-Academic Year 2016-2017',
    '19-Academic Year 2017-2018',
    '20-Academic Year 2018-2019',
    '21-Academic Year 2019-2020',
    '22-Academic Year 2020-2021',
    '23-Academic Year 2021-2022',
    '24-Academic Year 2022-2023',
    '25-Academic Year 2023-2024',
    '26-Academic Year 2024-2025',
    '27-Academic Year 2025-2026',
    '28-Academic Year 2026-2027',
    '29-Academic Year 2027-2028',
    '30-Academic Year 2028-2029',
    '31-Academic Year 2029-2030',
    '32-Academic Year 2030-2031',
    '33-Academic Year 2031-2032',
    '34-Academic Year 2032-2033',
    '35-Academic Year 2033-2034',
    '36-Academic Year 2034-2035',
    '37-Academic Year 2035-2036',
    '38-Academic Year 2036-2037',
    '39-Academic Year 2037-2038',
    '40-Academic Year 2038-2039',
    '41-Academic Year 2039-2040',
    '42-Academic Year 2040-2041',
    '43-Academic Year 2041-2042',
    '44-Academic Year 2042-2043',
    '45-Academic Year 2043-2044',
    '46-Academic Year 2044-2045',
    '47-Academic Year 2045-2046',
    '48-Academic Year 2046-2047',
    '49-Academic Year 2047-2048',
    '50-Academic Year 2048-2049',
    '51-Academic Year 2049-2050'
  ]
}


function getExcelColumnLetter(index) {
  let letter = '';
  let tempIndex = index;

  while (tempIndex >= 0) {
    const charCode = (tempIndex % 26) + 65;
    letter = String.fromCharCode(charCode) + letter;
    tempIndex = Math.floor(tempIndex / 26) - 1;
  }

  return letter;
}

async function createExcelTemplate(data, sheetName, dropdowns = {}) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);
  const dropdownWorksheet = workbook.addWorksheet('Dropdown Options');

  const headers = data.map((key) => ({
    header: key,
    key: key,
    width: 25,
  }));

  worksheet.columns = headers;

  if (Object.keys(dropdowns).length) {
    let rowIndex = 1;
    const dropdownRanges = {};

    for (const [key, options] of Object.entries(dropdowns)) {
      options.forEach((option, optionIndex) => {
        dropdownWorksheet.getCell(`A${rowIndex + optionIndex}`).value = option;
      });

      dropdownRanges[key] = `'Dropdown Options'!$A$${rowIndex}:$A$${rowIndex + options.length - 1}`;
      rowIndex += options.length;
    }

    headers.forEach((header, index) => {
      const fieldName = header.key;
      if (dropdowns[fieldName]) {
        const columnLetter = getExcelColumnLetter(index);
        for (let row = 2; row <= 101; row++) {
          worksheet.getCell(`${columnLetter}${row}`).dataValidation = {
            type: 'list',
            allowBlank: true,
            // formulae : "'Dropdown Options'!$A$1:$A$5"
            formulae: [dropdownRanges[fieldName]],
            showErrorMessage: true,
            errorTitle: 'Invalid selection',
            error: 'Select a valid option',
          };
        }
      }
    });
    dropdownWorksheet.protect('password');
  }


  await workbook.xlsx.writeFile('Template.xlsx');
}



module.exports = {
  createExcelTemplate
}

