import {
  UploadResourceRequest,
  UploadResourceResponse,
} from '../../common/model/upload/Resource';
import { cloudStorageHostName, publicCloudStorageBucket } from '../../Config';
import { FOLDER_PREFIX, IMAGE_PREFIX } from '../../lib/constant/Constant';
import Logger from '../../lib/core/Logger';
import { S3Service } from '../../third_party/s3/s3Service';

export class UploadUsecase {
  private s3Service: S3Service;

  constructor(s3Service: S3Service) {
    this.s3Service = s3Service;
  }

  async uploadResource(
    request: UploadResourceRequest,
  ): Promise<UploadResourceResponse> {
    const folderPrefix = FOLDER_PREFIX;
    const filePrefix = IMAGE_PREFIX;

    const fileName = `${folderPrefix}/${filePrefix}/${request.file_name}`;

    Logger.info(`Upload resource ${fileName} - ${request.content_type}`);

    const res = await this.s3Service.UploadResourceRequest(
      fileName,
      request.content_type,
      publicCloudStorageBucket,
    );
    return {
      data: {
        upload_url: res,
        resource_url: `${cloudStorageHostName}/${publicCloudStorageBucket}/${fileName}`,
      },
    };
  }
}
