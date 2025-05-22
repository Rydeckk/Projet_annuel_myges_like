/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from "@nestjs/common";
import { Storage } from "@google-cloud/storage";
import { Readable } from "stream";
import { MulterFile } from "multer";

@Injectable()
export class GoogleCloudStorageService {
    private storage: Storage;
    private bucketName: string;

    constructor() {
        this.storage = new Storage({
            projectId: process.env.GCS_PROJECT_ID,
            credentials: {
                client_email: process.env.GCS_CLIENT_EMAIL!,
                private_key: (process.env.GCS_PRIVATE_KEY || "").replace(
                    /\\n/g,
                    "\n",
                ),
            },
        });
        this.bucketName = "mygeslike-archive";
    }
    async uploadFile(file: MulterFile): Promise<string> {
        if (
            !file ||
            typeof file !== "object" ||
            typeof file.originalname !== "string" ||
            typeof file.mimetype !== "string" ||
            !(file as any).buffer
        ) {
            throw new Error("Invalid file");
        }

        const bucket = this.storage.bucket(this.bucketName);
        const blob = bucket.file(file.originalname as string);

        const blobStream = blob.createWriteStream({
            resumable: false,
            contentType: file.mimetype,
        });

        const readable = new Readable();
        readable._read = () => {};
        readable.push(file.buffer);
        readable.push(null);

        return new Promise((resolve, reject) => {
            blobStream.on("error", (error: Error) => reject(error));
            blobStream.on("finish", () => {
                const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${blob.name}`;
                resolve(publicUrl);
            });

            readable.pipe(blobStream);
        });
    }
}
