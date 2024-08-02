import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import s3Client, { cloudStorageBucket } from '../../Config';
import Logger from '../../lib/core/Logger';
import { InternalErrorResponse } from '../../lib/http/ApiResponse';
import { EXPIRED_SIGNED_URL } from '../../lib/constant/Constant';

export class S3Service {
  async UploadResourceRequest(
    filePath: string,
    contentType: string,
    bucketName: string,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: filePath,
      ContentType: contentType,
    });
    try {
      const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600,
      });
      return signedUrl;
    } catch (error: any) {
      Logger.error(
        `Failed to update file ${filePath} to  cloud storage ${bucketName}, error ${error}`,
      );
      throw new InternalErrorResponse(`Failed to upload file to cloud storage`);
    }
  }

  async UploadFile(fileBuffer: Buffer, originalName: string): Promise<string> {
    const key = `link-palette/${uuidv4()}/${originalName}`;

    const command = new PutObjectCommand({
      Bucket: cloudStorageBucket,
      Body: fileBuffer,
      Key: key,
      ACL: 'public-read',
      ContentType: 'application/octet-stream',
    });
    try {
      const res = await s3Client.send(command);
      Logger.info(`File uploaded at : ${res}`);
      return key;
    } catch (error: any) {
      Logger.error(
        `Failed to update file ${key} to cloud storage, error ${error}`,
      );
      throw new InternalErrorResponse(`Failed to upload file to cloud storage`);
    }
  }

  async GetSignUrl(filePath: string, bucketName: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: filePath,
        ResponseContentType: 'application/octet-stream',
      });

      const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: EXPIRED_SIGNED_URL,
      });

      return signedUrl;
    } catch (error) {
      Logger.error(
        `Failed to get pre-signed url for ${filePath}, error ${error}`,
      );
      throw new InternalErrorResponse('Failed to get presigned url');
    }
  }

  async GetDownloadUrl(filePath: string, bucketName: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: filePath,
        ResponseContentType: 'application/octet-stream',
      });

      const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: EXPIRED_SIGNED_URL,
      });

      return signedUrl;
    } catch (error) {
      Logger.error(
        `Failed to get download url for ${filePath}, error ${error}`,
      );
      throw new InternalErrorResponse('Failed to get download url');
    }
  }
}

export default new S3Service();
