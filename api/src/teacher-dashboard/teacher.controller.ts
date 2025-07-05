import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { TeacherService } from "./teacher.service";
import { JwtAuthGuard } from "src/auth/strategies/jwt/jwt-auth.guard";

@Controller("teacher")
@UseGuards(JwtAuthGuard)
export class TeacherController {
    constructor(private readonly teacherService: TeacherService) {}

    @Get("projects/:id/overview")
    getProjectOverview(@Param("id") projectId: string) {
        return this.teacherService.getProjectOverview(projectId);
    }

    @Get("projects/:id/submissions")
    getProjectSubmissions(@Param("id") projectId: string) {
        return this.teacherService.getProjectSubmissions(projectId);
    }

    @Get("projects/:id/compliance")
    getProjectCompliance(@Param("id") projectId: string) {
        return this.teacherService.getProjectCompliance(projectId);
    }

    @Get("projects/:id/similarity")
    getProjectSimilarity(@Param("id") projectId: string) {
        return this.teacherService.getProjectSimilarity(projectId);
    }
}
