const AWS = {
  ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  SECRET_KEY: process.env.AWS_SECRET_KEY,
};

const s3Config = {
  BUCKET_NAME: process.env.AWS_S3_BUCKET,
  BUCKET_REGION: process.env.AWS_S3_REGION,
  PRESIGNED_URL_EXPIRY: 15 * 60, // 900 seconds(15 mins)
  BASE_PATHS: {
    student: 'student',
    parent: 'parent',
    fallbackPath: 'general',
  },
  DEFAULT_EXTENSION: 'pdf',
  DEFAULT_CONTENT_TYPE: 'application/octet-stream',
  BUCKET_URL:process.env.BUCKET_URL,
};

const cdnUrl = process.env.AWS_CDN_URL;

module.exports = {
  AWS,
  s3Config,
  cdnUrl,
};
