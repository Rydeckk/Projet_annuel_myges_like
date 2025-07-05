import {
    Body,
    Controller,
    Delete,
    FileTypeValidator,
    Get,
    MaxFileSizeValidator,
    NotFoundException,
    Param,
    ParseFilePipe,
    Post,
    Put,
    SerializeOptions,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { CreateProjectDto, UpdateProjectDto } from "./dto/project.dto";
import { GetCurrentUser } from "decorators/user.decorator";
import { ProjectEntity } from "./entities/project.entity";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileService } from "src/services/file.service";
import { BUCKET_DESTINATION } from "constants/bucket.constant";
import {
    ALLOWED_PROJECT_FILES,
    FILE_SIZE_LIMIT,
} from "constants/file.constant";

@Controller("projects")
export class ProjectsController {
    constructor(
        private readonly projectsService: ProjectsService,
        private readonly fileService: FileService,
    ) {}

    @Get("me")
    @SerializeOptions({ type: ProjectEntity })
    async findAllTeacherProject(@GetCurrentUser("id") userScopeId: string) {
        return this.projectsService.findAll({
            createdByTeacherId: userScopeId,
        });
    }

    @Post()
    @UseInterceptors(FileInterceptor("file"))
    @SerializeOptions({ type: ProjectEntity })
    async create(
        @GetCurrentUser("id") userScopeId: string,
        @Body() project: CreateProjectDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: FILE_SIZE_LIMIT }),
                    new FileTypeValidator({ fileType: ALLOWED_PROJECT_FILES }),
                ],
                fileIsRequired: false,
            }),
        )
        file?: Express.Multer.File,
    ) {
        const uploadedFile = file
            ? await this.fileService.uploadFile(
                  file,
                  BUCKET_DESTINATION.PROJECT,
              )
            : null;

        return this.projectsService.create(userScopeId, {
            ...project,
            ...(file && uploadedFile
                ? {
                      fileName: uploadedFile.fileName,
                      fileSize: file.size,
                      path: uploadedFile.publicUrl,
                  }
                : {}),
        });
    }

    @Put(":id")
    @UseInterceptors(FileInterceptor("file"))
    @SerializeOptions({ type: ProjectEntity })
    async update(
        @GetCurrentUser("id") userScopeId: string,
        @Param("id") projectId: string,
        @Body() project: UpdateProjectDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: FILE_SIZE_LIMIT }),
                    new FileTypeValidator({ fileType: ALLOWED_PROJECT_FILES }),
                ],
                fileIsRequired: false,
            }),
        )
        file?: Express.Multer.File,
    ) {
        const foundProject = await this.projectsService.findUnique({
            id: projectId,
        });

        if (!foundProject) {
            throw new NotFoundException();
        }

        if (file && foundProject.fileName) {
            await this.fileService.removeFile(
                foundProject.fileName,
                BUCKET_DESTINATION.PROJECT,
            );
        }

        const uploadedFile = file
            ? await this.fileService.uploadFile(
                  file,
                  BUCKET_DESTINATION.PROJECT,
              )
            : null;

        return this.projectsService.update({
            createdByTeacherId: userScopeId,
            projectId,
            data: {
                ...project,
                ...(file && uploadedFile
                    ? {
                          fileName: uploadedFile.fileName,
                          fileSize: file.size,
                          path: uploadedFile.publicUrl,
                      }
                    : {}),
            },
        });
    }

    @Delete(":id")
    @SerializeOptions({ type: ProjectEntity })
    async delete(
        @GetCurrentUser("id") userScopeId: string,
        @Param("id") projectId: string,
    ) {
        const deletedProject = await this.projectsService.delete(
            projectId,
            userScopeId,
        );
        if (deletedProject.fileName) {
            await this.fileService.removeFile(
                deletedProject.fileName,
                BUCKET_DESTINATION.PROJECT,
            );
        }
        return deletedProject;
    }
}
