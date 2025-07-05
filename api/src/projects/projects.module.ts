import { Module } from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { ProjectsController } from "./projects.controller";
import { FileService } from "src/services/file.service";

@Module({
    controllers: [ProjectsController],
    providers: [ProjectsService, FileService],
})
export class ProjectsModule {}
