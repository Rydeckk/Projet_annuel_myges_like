import {
    Body,
    Controller,
    Delete,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    SerializeOptions,
} from "@nestjs/common";
import { ProjectGroupsService } from "./project-groups.service";
import {
    CreateProjectGroupDto,
    UpdateProjectGroupDto,
} from "./dto/project-group.dto";
import { ProjectGroupEntity } from "./entities/project-group.entity";

@Controller("project-groups")
export class ProjectGroupsController {
    constructor(private readonly projectGroupsService: ProjectGroupsService) {}

    @Post()
    @SerializeOptions({ type: ProjectGroupEntity })
    async create(@Body() createProjectGroupDto: CreateProjectGroupDto) {
        return this.projectGroupsService.create(createProjectGroupDto);
    }

    @Put(":id")
    @SerializeOptions({ type: ProjectGroupEntity })
    async update(
        @Param("id", ParseUUIDPipe) projectGroupId: string,
        @Body() updateProjectGroupDto: UpdateProjectGroupDto,
    ) {
        return this.projectGroupsService.update(
            projectGroupId,
            updateProjectGroupDto,
        );
    }

    @Delete(":id")
    @SerializeOptions({ type: ProjectGroupEntity })
    async delete(@Param("id", ParseUUIDPipe) projectGroupId: string) {
        return this.projectGroupsService.delete(projectGroupId);
    }
}
