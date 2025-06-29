import { Module } from "@nestjs/common";
import { ProjectGroupStudentsService } from "./project-group-students.service";
import { ProjectGroupStudentsController } from "./project-group-students.controller";

@Module({
    controllers: [ProjectGroupStudentsController],
    providers: [ProjectGroupStudentsService],
})
export class ProjectGroupStudentsModule {}
