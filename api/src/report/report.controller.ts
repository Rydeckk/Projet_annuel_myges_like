import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from "@nestjs/common";
import { ReportService } from "./report.service";
import { CreateReportDto, UpdateReportDto } from "./dto/report.dto";

@Controller("report")
export class ReportController {
    constructor(private readonly reportService: ReportService) {}

    @Post()
    create(@Body() createReportDto: CreateReportDto) {
        return this.reportService.create(createReportDto);
    }

    @Get()
    findAll() {
        return this.reportService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.reportService.findOne(id);
    }

    @Get("project-group/:projectGroupId")
    findByProjectGroupId(@Param("projectGroupId") projectGroupId: string) {
        return this.reportService.findByProjectGroupId(projectGroupId);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateReportDto: UpdateReportDto) {
        return this.reportService.update(id, updateReportDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.reportService.remove(id);
    }
}
