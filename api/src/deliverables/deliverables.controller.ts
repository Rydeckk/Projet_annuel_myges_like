import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
} from "@nestjs/common";
import { DeliverablesService } from "./deliverables.service";
import {
    CreateDeliverableDto,
    UpdateDeliverableDto,
    AttachFileToDeliverableDto,
    AttachGitToDeliverableDto,
    SubmitDeliverableDto,
} from "./dto/deliverable.dto";
import { JwtAuthGuard } from "src/auth/strategies/jwt/jwt-auth.guard";
import { Student } from "@prisma/client";

interface AuthenticatedRequest {
    user: Student;
}

@Controller("deliverables")
@UseGuards(JwtAuthGuard)
export class DeliverablesController {
    constructor(private readonly deliverablesService: DeliverablesService) {}

    @Post()
    create(
        @Request() req: AuthenticatedRequest,
        @Body() createDeliverableDto: CreateDeliverableDto,
    ) {
        return this.deliverablesService.create(
            req.user.id,
            createDeliverableDto,
        );
    }

    @Get("project-group/:projectGroupId")
    findByProjectGroup(@Param("projectGroupId") projectGroupId: string) {
        return this.deliverablesService.findByProjectGroup(projectGroupId);
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.deliverablesService.findOne(id);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Request() req: AuthenticatedRequest,
        @Body() updateDeliverableDto: UpdateDeliverableDto,
    ) {
        return this.deliverablesService.update(
            id,
            req.user.id,
            updateDeliverableDto,
        );
    }

    @Delete(":id")
    remove(@Param("id") id: string, @Request() req: AuthenticatedRequest) {
        return this.deliverablesService.remove(id, req.user.id);
    }

    @Post(":id/attach-file")
    attachFile(
        @Param("id") id: string,
        @Request() req: AuthenticatedRequest,
        @Body() attachFileDto: AttachFileToDeliverableDto,
    ) {
        return this.deliverablesService.attachFile(
            id,
            req.user.id,
            attachFileDto.fileUrl,
            attachFileDto.fileName,
            attachFileDto.fileSize,
        );
    }

    @Get(":id/download")
    downloadArchive(
        @Param("id") id: string,
        @Request() req: AuthenticatedRequest,
    ) {
        return this.deliverablesService.downloadArchive(id, req.user.id);
    }

    @Get(":id/validation-results")
    getValidationResults(@Param("id") id: string) {
        return this.deliverablesService.getDeliverableValidationResults(id);
    }

    @Post(":id/attach-git")
    attachGit(
        @Param("id") id: string,
        @Request() req: AuthenticatedRequest,
        @Body() attachGitDto: AttachGitToDeliverableDto,
    ) {
        return this.deliverablesService.attachGit(
            id,
            req.user.id,
            attachGitDto.gitUrl,
            attachGitDto.branch,
        );
    }

    @Post(":id/submit")
    submit(
        @Param("id") id: string,
        @Request() req: AuthenticatedRequest,
        @Body() submitDto: SubmitDeliverableDto,
    ) {
        return this.deliverablesService.submit(id, req.user.id, submitDto);
    }

    @Get(":id/compliance")
    checkCompliance(@Param("id") id: string) {
        return this.deliverablesService.checkCompliance(id);
    }

    @Post(":id/validate")
    validate(@Param("id") id: string, @Request() req: AuthenticatedRequest) {
        return this.deliverablesService.validateAgainstRules(id, req.user.id);
    }
}
