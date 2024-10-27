import { S3Client } from '@aws-sdk/client-s3';
import process from 'node:process';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
// Mapper for environment variables
export const environment = process.env.NODE_ENV;
export const port = process.env.PORT;
export const timezone = process.env.TZ;

export const db = {
  name: process.env.DB_NAME || '',
  host: process.env.DB_HOST || '',
  port: process.env.DB_PORT || '',
  user: process.env.DB_USER || '',
  password: process.env.DB_USER_PWD || '',
  minPoolSize: parseInt(process.env.DB_MIN_POOL_SIZE || '5'),
  maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE || '10'),
};

export const corsUrl = process.env.CORS_URL;

export const tokenInfo = {
  accessTokenValidity: parseInt(process.env.ACCESS_TOKEN_VALIDITY_SEC || '0'),
  refreshTokenValidity: parseInt(process.env.REFRESH_TOKEN_VALIDITY_SEC || '0'),
  issuer: process.env.TOKEN_ISSUER || '',
  audience: process.env.TOKEN_AUDIENCE || '',
};

export const logDirectory = process.env.LOG_DIR;

export const redis = {
  host: process.env.REDIS_HOST || '',
  port: parseInt(process.env.REDIS_PORT || '0'),
  password: process.env.REDIS_PASSWORD || '',
};

export const caching = {
  contentCacheDuration: parseInt(
    process.env.CONTENT_CACHE_DURATION_MILLIS || '600000',
  ),
};

export const gmo = {
  siteId: process.env.GMO_SITE_ID || '',
  sitePassword: process.env.GMO_SITE_PASSWORD || '',
  shopId: process.env.GMO_SHOP_ID || '',
  shopPassword: process.env.GMO_SHOP_PASSWORD || '',
  url: process.env.GMO_URL || '',
};

const s3Client = new S3Client({
  region: process.env.CLOUD_STORAGE_REGION,
  endpoint: process.env.CLOUD_STORAGE_HOST_NAME,
  credentials: {
    accessKeyId: process.env.CLOUD_STORAGE_ACCESS_KEY
      ? process.env.CLOUD_STORAGE_ACCESS_KEY
      : '',
    secretAccessKey: process.env.CLOUD_STORAGE_SECRET_KEY
      ? process.env.CLOUD_STORAGE_SECRET_KEY
      : '',
  },
});

export default s3Client;

export const cloudStorageBucket = process.env.CLOUD_STORAGE_BUCKET
  ? process.env.CLOUD_STORAGE_BUCKET
  : '4fan';

export const cloudStorageHostName = process.env.CLOUD_STORAGE_HOST_NAME;
export const folderPrefix = process.env.FOLDER_PREFIX;

export const daysBeforeNextDate = parseInt(
  process.env.SUB_DAYS_BEFORE_NEXT_DATE || '10',
);
export const maxDaysRetryAttempts = parseInt(
  process.env.SUB_MAX_DAYS_RETRY_ATTEMPTS || '5',
);
export const subCronExpression = process.env.SUB_CRON_EXPRESSION || '0 2 * * *';

export const mailConfig: SMTPTransport.Options = {
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT) : 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER || 'default_user',
    pass: process.env.MAIL_PASS || 'default_pass',
  },
  tls: {
    rejectUnauthorized: false,
  },
};

export const sso = {
  url: process.env.SSO_URL || '',
};
