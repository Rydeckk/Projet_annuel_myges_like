import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    SerializeOptions,
    ParseUUIDPipe,
} from "@nestjs/common";
import { ReportService } from "./report.service";
import { CreateReportDto, UpdateReportDto } from "./dto/report.dto";
import { ReportEntity } from "./entities/report.entity";
import { GetCurrentUser } from "decorators/user.decorator";

@Controller("report")
export class ReportController {
    constructor(private readonly reportService: ReportService) {}

    @Post()
    async create(
        @Body() createReportDto: CreateReportDto,
        @GetCurrentUser("id") userScopeId: string,
    ) {
        return this.reportService.create(userScopeId, createReportDto);
    }

    @Get(":id")
    @SerializeOptions({ type: ReportEntity })
    async findOne(@Param("id", ParseUUIDPipe) id: string) {
        return this.reportService.findUnique({
            id,
        });
    }

    @Get("project-group/:projectGroupId")
    @SerializeOptions({ type: ReportEntity })
    async findByProjectGroupId(
        @Param("projectGroupId", ParseUUIDPipe) projectGroupId: string,
    ) {
        return this.reportService.findUnique({
            projectGroupId,
        });
    }

    @Patch(":id")
    @SerializeOptions({ type: ReportEntity })
    async update(
        @Param("id", ParseUUIDPipe) id: string,
        @Body() updateReportDto: UpdateReportDto,
    ) {
        return this.reportService.update(id, updateReportDto);
    }

    @Delete(":id")
    @SerializeOptions({ type: ReportEntity })
    async remove(@Param("id", ParseUUIDPipe) id: string) {
        return this.reportService.remove(id);
    }
}
