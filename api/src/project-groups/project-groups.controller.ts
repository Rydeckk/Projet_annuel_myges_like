import { Controller } from "@nestjs/common";
import { ProjectGroupsService } from "./project-groups.service";

@Controller("project-groups")
export class ProjectGroupsController {
    constructor(private readonly projectGroupsService: ProjectGroupsService) {}
}
