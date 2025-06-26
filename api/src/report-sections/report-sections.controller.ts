import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    SerializeOptions,
} from "@nestjs/common";
import { ReportSectionsService } from "./report-sections.service";
import { ReportSectionsEntity } from "./entities/report-sections.entity";
import { GetCurrentUser } from "decorators/user.decorator";
import {
    CreateReportSectionsDto,
    UpdateReportSectionsDto,
} from "./dto/report-sections.dto";

@Controller("report-sections")
export class ReportSectionsController {
    constructor(
        private readonly reportSectionsService: ReportSectionsService,
    ) {}

    @Post()
    @SerializeOptions({ type: ReportSectionsEntity })
    async create(
        @Body() createReportSectionsDto: CreateReportSectionsDto,
        @GetCurrentUser("id") userScopeId: string,
    ) {
        return this.reportSectionsService.create(
            userScopeId,
            createReportSectionsDto,
        );
    }

    @Get("promotion-project/:promotionProjectId")
    @SerializeOptions({ type: ReportSectionsEntity })
    async findAll(@Param("promotionProjectId") promotionProjectId: string) {
        return this.reportSectionsService.findAll(promotionProjectId);
    }

    @Patch(":id")
    @SerializeOptions({ type: ReportSectionsEntity })
    async update(
        @Param("id", ParseUUIDPipe) id: string,
        @Body() updateReportSectionsDto: UpdateReportSectionsDto,
    ) {
        return this.reportSectionsService.update(id, updateReportSectionsDto);
    }

    @Delete(":id")
    @SerializeOptions({ type: ReportSectionsEntity })
    async remove(@Param("id", ParseUUIDPipe) id: string) {
        return this.reportSectionsService.delete(id);
    }
}
