import { Module } from "@nestjs/common";
import { ProjectGroupService } from "./project-group.service";
import { ProjectGroupController } from "./project-group.controller";

@Module({
    controllers: [ProjectGroupController],
    providers: [ProjectGroupService],
})
export class ProjectGroupModule {}
