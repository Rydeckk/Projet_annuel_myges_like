import { Bucket, Storage } from "@google-cloud/storage";
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { parse } from "path";
import { BUCKET_NAME, BucketDestination } from "constants/bucket.constant";

@Injectable()
export class FileService {
    private bucket: Bucket;
    private storage: Storage;

    constructor(readonly configService: ConfigService) {
        this.storage = new Storage({
            projectId: this.configService.get<string>("google.cloud.projectId"),
            credentials: {
                client_email: this.configService.get<string>(
                    "google.cloud.clientEmail",
                ),
                private_key: this.configService.get<string>(
                    "google.cloud.privateKey",
                ),
            },
        });
        this.bucket = this.storage.bucket(BUCKET_NAME);
    }

    private setDestination(destination: string): string {
        let escDestination = "";
        escDestination += destination
            .replace(/^\.+/g, "")
            .replace(/^\/+|\/+$/g, "");
        if (escDestination !== "") escDestination = escDestination + "/";
        return escDestination;
    }

    private setFilename(uploadedFile: Express.Multer.File) {
        const fileName = parse(uploadedFile.originalname);
        return `${fileName.name}-${Date.now()}${fileName.ext}`
            .replace(/^\.+/g, "")
            .replace(/^\/+/g, "")
            .replace(/\r|\n/g, "_");
    }

    async uploadFile(
        uploadedFile: Express.Multer.File,
        destination: BucketDestination,
    ) {
        const fileName = this.setFilename(uploadedFile);
        const destinationWithfileName =
            this.setDestination(destination) + this.setFilename(uploadedFile);

        const file = this.bucket.file(destinationWithfileName);
        try {
            await file.save(uploadedFile.buffer, {
                contentType: uploadedFile.mimetype,
            });
        } catch {
            throw new InternalServerErrorException(
                "Unexpected error on file upload",
            );
        }
        return {
            fileName,
            publicUrl: `https://storage.googleapis.com/${this.bucket.name}/${file.name}`,
        };
    }

    async removeFile(fileName: string, destination: BucketDestination) {
        const file = this.bucket.file(`${destination}/${fileName}`);
        try {
            await file.delete();
        } catch {
            throw new BadRequestException();
        }
    }
}
