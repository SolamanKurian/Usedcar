import { S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

// Check if required environment variables are set
if (!process.env.CLOUDFLARE_ACCOUNT_ID) {
  throw new Error('CLOUDFLARE_ACCOUNT_ID environment variable is not set');
}
if (!process.env.R2_ACCESS_KEY_ID) {
  throw new Error('R2_ACCESS_KEY_ID environment variable is not set');
}
if (!process.env.R2_SECRET_ACCESS_KEY) {
  throw new Error('R2_SECRET_ACCESS_KEY environment variable is not set');
}
if (!process.env.CLOUDFLARE_R2_BUCKET_NAME) {
  throw new Error('CLOUDFLARE_R2_BUCKET_NAME environment variable is not set');
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;

export { s3Client, bucketName };

// Function to generate presigned URL for uploading
export async function generatePresignedUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

// Function to generate presigned URL for downloading/viewing
export async function generateDownloadUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
} 