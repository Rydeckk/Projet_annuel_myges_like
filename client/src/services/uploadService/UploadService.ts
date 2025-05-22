import { UploadRequest } from "@/types/Project";
import { Api } from "../api/Api";

export class UploadService {
  api: Api;

  constructor({ api = new Api() }: { api?: Api } = {}) {
    this.api = api;
  }

  upload(data: UploadRequest) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("file", data.file);

    return this.api.request({
      path: `upload`,
      method: "POST",
      data: formData,
    });
  }
}
