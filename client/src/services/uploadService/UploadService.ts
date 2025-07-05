import { UploadRequest } from "@/types/Project";
import { Api } from "../api/Api";

export class UploadService {
  api: Api;

  constructor({ api = new Api() }: { api?: Api } = {}) {
    this.api = api;
  }

  upload(data: UploadRequest): Promise<string> {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("file", data.file);

    return this.api.request<string>({
      path: `upload`,
      method: "POST",
      data: formData,
      contentType: null,
    });
  }
}
