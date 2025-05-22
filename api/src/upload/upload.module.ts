import { Module } from "@nestjs/common";
import { UploadService } from "./upload.service";
import { UploadController } from "./upload.controller";
import { GoogleCloudStorageService } from "src/google-cloud-storage/google-cloud-storage.service";

@Module({
    controllers: [UploadController],
    providers: [UploadService, GoogleCloudStorageService],
})
export class UploadModule {}
