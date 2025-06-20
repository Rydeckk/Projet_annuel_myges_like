import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    SerializeOptions,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { CreateProjectDto, UpdateProjectDto } from "./dto/project.dto";
import { GetCurrentUser } from "src/decorators/user.decorator";
import { ProjectEntity } from "./entities/project.entity";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileService } from "src/services/file.service";
import { BUCKET_DESTINATION } from "src/constants/bucket.constant";

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
        @UploadedFile() file: Express.Multer.File,
    ) {
        const uploadedFile = await this.fileService.uploadFile(
            file,
            BUCKET_DESTINATION.PROJECT,
        );

        return this.projectsService.create(userScopeId, {
            ...project,
            ...(file
                ? {
                      fileName: file.originalname,
                      fileSize: file.size,
                      path: uploadedFile.publicUrl,
                  }
                : {}),
        });
    }

    @Put(":id")
    @SerializeOptions({ type: ProjectEntity })
    async update(
        @GetCurrentUser("id") userScopeId: string,
        @Param("id") projectId: string,
        @Body() project: UpdateProjectDto,
    ) {
        return this.projectsService.update({
            createdByTeacherId: userScopeId,
            projectId,
            data: project,
        });
    }

    @Delete(":id")
    @SerializeOptions({ type: ProjectEntity })
    async delete(
        @GetCurrentUser("id") userScopeId: string,
        @Param("id") projectId: string,
    ) {
        return this.projectsService.delete(projectId, userScopeId);
    }
}
