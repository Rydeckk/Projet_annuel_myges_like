import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import { UploadService } from "./upload.service";
import { Public } from "decorators/is-public.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterFile } from "multer";

@Controller("upload")
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @Public()
    @Post()
    @UseInterceptors(FileInterceptor("file"))
    async uploadFile(@UploadedFile() file: MulterFile) {
        return this.uploadService.uploadFile(file);
    }
}
