import { v4 as uuidv4 } from 'uuid';
import {
  UploadResourceRequest,
  UploadResourceResponse,
} from '../../common/model/upload/Resource';
import {
  cloudStorageBucket,
  cloudStorageHostName,
  folderPrefix,
} from '../../Config';
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
    const fileName = request.sub_folder
      ? `${folderPrefix}/${request.sub_folder}/${uuidv4()}/${request.file_name}`
      : `${folderPrefix}/${uuidv4()}/${request.file_name}`;

    Logger.info(`Upload resource ${fileName} - ${request.content_type}`);

    const res = await this.s3Service.UploadResourceRequest(
      fileName,
      request.content_type,
      cloudStorageBucket,
    );
    return {
      data: {
        upload_url: res,
        resource_url: `${cloudStorageHostName}/${cloudStorageBucket}/${fileName}`,
      },
    };
  }
}
