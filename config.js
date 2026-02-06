import dotenv from 'dotenv';
dotenv.config();

export default {
  oss: {
    region: process.env.OSS_REGION || 'oss-cn-shenzhen', // Default region, adjust as needed
    accessKeyId: process.env.OSS_ACCESS_KEY_ID || 'LTAI5t8q5WU5fEDwnneBPM73',
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET || 'access_key_secret',
    bucket: process.env.OSS_BUCKET || 'everyusb-usky',
    endpoint: process.env.OSS_ENDPOINT || 'oss-cn-shenzhen.aliyuncs.com'
  }
};
