import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    SerializeOptions,
} from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { CreateProjectDto, UpdateProjectDto } from "./dto/project.dto";
import { GetCurrentUser } from "decorators/user.decorator";
import { ProjectEntity } from "./entities/project.entity";

@Controller("projects")
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Get("me")
    @SerializeOptions({ type: ProjectEntity })
    async findAllTeacherProject(@GetCurrentUser("id") userScopeId: string) {
        return this.projectsService.findAll({
            createdByTeacherId: userScopeId,
        });
    }

    @Post()
    @SerializeOptions({ type: ProjectEntity })
    async create(
        @GetCurrentUser("id") userScopeId: string,
        @Body() project: CreateProjectDto,
    ) {
        return this.projectsService.create(userScopeId, project);
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
