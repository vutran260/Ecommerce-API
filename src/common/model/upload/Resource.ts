export class UploadResourceRequest {
  file_name: string;
  content_type: string;
  sub_folder: string;
}

export class UploadResourceResponse {
  data: UploadResourceData;
}

export class UploadResourceData {
  upload_url: string;
  resource_url: string;
}
