import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    SerializeOptions,
} from "@nestjs/common";
import { ProjectGroupService } from "./project-group.service";
import { ProjectGroupEntity } from "./entities/project-group.entity";
import {
    CreateAllProjectGroupsDto,
    CreateProjectGroupDto,
    CreateProjectGroupStudentDto,
} from "./dto/project-group.dto";
import { ProjectGroupStudentEntity } from "./entities/project-group-student.entity";
import { GetCurrentUser } from "decorators/user.decorator";

@Controller("project-groups")
export class ProjectGroupController {
    constructor(private readonly projectGroupService: ProjectGroupService) {}

    @Post()
    @SerializeOptions({ type: ProjectGroupEntity })
    async create(@Body() createProjectGroupDto: CreateProjectGroupDto) {
        return await this.projectGroupService.create(createProjectGroupDto);
    }

    @Post("all")
    @SerializeOptions({ type: ProjectGroupEntity })
    async createAllProjectGroups(
        @Body() createProjectGroupDto: CreateAllProjectGroupsDto,
    ) {
        return await this.projectGroupService.createAllProjectGroups(
            createProjectGroupDto,
        );
    }

    @Post("student")
    @SerializeOptions({ type: ProjectGroupStudentEntity })
    async createProjectGroupStudent(
        @Body() createProjectGroupStudentDto: CreateProjectGroupStudentDto,
    ) {
        return await this.projectGroupService.createProjectGroupStudent(
            createProjectGroupStudentDto,
        );
    }

    @Get("promotion-project/:promotionProjectId")
    @SerializeOptions({ type: ProjectGroupEntity })
    async findAll(@Param("promotionProjectId") promotionProjectId: string) {
        return await this.projectGroupService.findMany({
            promotionProjectId: promotionProjectId,
        });
    }

    @Get("promotion-project/:promotionProjectId/me")
    @SerializeOptions({ type: ProjectGroupStudentEntity })
    async findMyProjectGroup(
        @Param("promotionProjectId") promotionProjectId: string,
        @GetCurrentUser("id") userScopeId: string,
    ) {
        return await this.projectGroupService.findMyProjectGroup(
            promotionProjectId,
            userScopeId,
        );
    }
}
