const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3')
const crypto = require('crypto');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { AWS, s3Config } = require('../config/aws.config')

// s3Configuration

const s3Client = new S3Client({
  credentials: {
    accessKeyId: AWS.ACCESS_KEY,
    secretAccessKey: AWS.SECRET_KEY,
  },
  region: s3Config.BUCKET_REGION,
})


const generatePutObjectCommand = (filePath, fileName, extension, contentType) => {
  const putConfig = {
    Bucket: s3Config.BUCKET_NAME,
    Key: `${filePath}/${fileName}.${extension}`,
    ContentType: contentType,
  }

  return new PutObjectCommand(putConfig)
}



const generateGetObjectCommand = (key) => {
  const getConfig = {
    Bucket: s3Config.BUCKET_NAME,
    Key: key
  };
  return new GetObjectCommand(getConfig)
}


const getDocumentUploadUrl = async (filePath = s3Config.BASE_PATHS.fallbackPath, fileExtension = s3Config.DEFAULT_EXTENSION, contentType = s3Config.DEFAULT_CONTENT_TYPE, fileName = crypto.randomUUID()) => {
  const uploadCommand = generatePutObjectCommand(filePath, fileName, fileExtension, contentType);
  const uploadUrl = await getSignedUrl(s3Client, uploadCommand, { expiresIn: s3Config.PRESIGNED_URL_EXPIRY })
  return uploadUrl;
}

const getDocumentFromUrl = async (url) => {
  const s3Url = url?.split('?')[0];
  const key = s3Url.split('amazonaws.com/')[1];
  const command = generateGetObjectCommand(key);
  const response = await s3Client.send(command);
  return response.Body;
}


module.exports = {
  getDocumentUploadUrl,
  getDocumentFromUrl
}