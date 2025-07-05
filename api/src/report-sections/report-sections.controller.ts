import {
    Body,
    Controller,
    Delete,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    SerializeOptions,
} from "@nestjs/common";
import { ReportSectionsService } from "./report-sections.service";
import { ReportSectionEntity } from "./entities/report-section.entity";
import { GetCurrentUser } from "decorators/user.decorator";
import {
    CreateReportSectionsDto,
    DeleteReportSectionDto,
    UpdateReportSectionsDto,
} from "./dto/report-section.dto";

@Controller("report-sections")
export class ReportSectionsController {
    constructor(
        private readonly reportSectionsService: ReportSectionsService,
    ) {}

    @Post()
    @SerializeOptions({ type: ReportSectionEntity })
    async create(
        @Body() createReportSectionsDto: CreateReportSectionsDto,
        @GetCurrentUser("id") userScopeId: string,
    ) {
        return this.reportSectionsService.create(
            userScopeId,
            createReportSectionsDto,
        );
    }

    @Patch(":id")
    @SerializeOptions({ type: ReportSectionEntity })
    async update(
        @Param("id", ParseUUIDPipe) id: string,
        @Body() updateReportSectionsDto: UpdateReportSectionsDto,
        @GetCurrentUser("id") userScopeId: string,
    ) {
        return this.reportSectionsService.update(
            id,
            userScopeId,
            updateReportSectionsDto,
        );
    }

    @Delete(":id")
    @SerializeOptions({ type: ReportSectionEntity })
    async remove(
        @Param("id", ParseUUIDPipe) id: string,
        @GetCurrentUser("id") userScopeId: string,
        @Body() deleteReportSectionDto: DeleteReportSectionDto,
    ) {
        return this.reportSectionsService.delete(
            id,
            userScopeId,
            deleteReportSectionDto,
        );
    }
}
