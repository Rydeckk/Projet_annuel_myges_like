import { Bucket, Storage } from "@google-cloud/storage";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { parse } from "path";

@Injectable()
export class FileService {
    private bucket: Bucket;
    private storage: Storage;

    constructor() {
        this.storage = new Storage();
        this.bucket = this.storage.bucket("");
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

    async uploadFile(uploadedFile: Express.Multer.File, destination: string) {
        const fileName =
            this.setDestination(destination) + this.setFilename(uploadedFile);
        const file = this.bucket.file(fileName);
        try {
            await file.save(uploadedFile.buffer, {
                contentType: uploadedFile.mimetype,
            });
        } catch {
            throw new InternalServerErrorException();
        }
        return {
            ...file.metadata,
            publicUrl: `https://storage.googleapis.com/${this.bucket.name}/${file.name}`,
        };
    }
}
