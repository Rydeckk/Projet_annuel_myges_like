import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    SerializeOptions,
    ParseUUIDPipe,
    Query,
} from "@nestjs/common";
import { ReportService } from "./report.service";
import { CreateReportDto } from "./dto/report.dto";
import { ReportEntity } from "./entities/report.entity";
import { GetCurrentUser } from "decorators/user.decorator";

@Controller("report")
export class ReportController {
    constructor(private readonly reportService: ReportService) {}

    @Post()
    async upsert(
        @Body() createReportDto: CreateReportDto,
        @GetCurrentUser("id") userScopeId: string,
    ) {
        return this.reportService.upsert(userScopeId, createReportDto);
    }

    @Get("project-group/:projectGroupId")
    @SerializeOptions({ type: ReportEntity })
    async findByProjectGroupId(
        @Param("projectGroupId", ParseUUIDPipe) projectGroupId: string,
    ) {
        return this.reportService.findAll({
            projectGroupId,
        });
    }

    @Get("promotion/:promotionId")
    @SerializeOptions({ type: ReportEntity })
    async findByPromotionId(
        @Param("promotionId", ParseUUIDPipe) promotionId: string,
    ) {
        return this.reportService.findAll({
            reportSection: {
                promotionProject: {
                    promotionId,
                },
            },
        });
    }

    @Get(
        "/promotion/:promotionId/project/:projectName/project-group/:projectGroupName/content",
    )
    @SerializeOptions({ type: ReportEntity })
    async findByProjectAndGroup(
        @Param("promotionId", ParseUUIDPipe) promotionId: string,
        @Param("projectName") projectName: string,
        @Param("projectGroupName") projectGroupName: string,
        @Query("reportSectionName") reportSectionName: string,
    ) {
        return this.reportService.getContent(
            promotionId,
            projectName,
            projectGroupName,
            reportSectionName,
        );
    }
}
