import { Injectable } from "@nestjs/common";
import { GoogleCloudStorageService } from "src/google-cloud-storage/google-cloud-storage.service";
type MulterFile = Express.Multer.File;

@Injectable()
export class UploadService {
    constructor(private readonly gcsService: GoogleCloudStorageService) {}

    async uploadFile(file: MulterFile): Promise<string> {
        const url = await this.gcsService.uploadFile(file);
        return url;
    }
}
