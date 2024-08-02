import { S3Service } from '../../third_party/s3/s3Service';
import { cloudStorageBucket } from '../../Config';
import { BadRequestError } from '../../lib/http/custom_error/ApiError';
import express, { Response } from 'express';
import multer from 'multer';
import { ResponseData } from '../../lib/http/Response';
import { ProtectedRequest } from '../../lib/http/app-request';
import { ALLOW_MINE_TYPE, MAX_FILE_SIZE } from '../../lib/constant/Constant';

export const upload = multer({
  storage: multer.memoryStorage(),
});

export class UploadEndpoint {
  private s3Service: S3Service;

  constructor(s3Service: S3Service) {
    this.s3Service = s3Service;
  }

  // API testing upload file
  private uploadFile = async (req: ProtectedRequest, res: Response) => {
    if (!req.file) {
      throw new BadRequestError('File not found');
    }

    if (!req.file.mimetype.startsWith(ALLOW_MINE_TYPE)) {
      throw new BadRequestError('Invalid file type. Only images are allowed.');
    }

    if (req.file.size > MAX_FILE_SIZE) {
      throw new BadRequestError('File size exceeds than 10MB');
    }
    const uploadedKey = await this.s3Service.UploadFile(
      req.file.buffer,
      req.file.originalname,
    );
    const url = await this.s3Service.GetSignUrl(
      uploadedKey,
      cloudStorageBucket,
    );
    return ResponseData(url, res);
  };

  public getRouter() {
    const router = express.Router();
    router.post('/upload', upload.single('file'), this.uploadFile);

    return router;
  }
}
