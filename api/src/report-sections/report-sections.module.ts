import { Module } from "@nestjs/common";
import { ReportSectionsService } from "./report-sections.service";
import { ReportSectionsController } from "./report-sections.controller";

@Module({
    controllers: [ReportSectionsController],
    providers: [ReportSectionsService],
})
export class ReportSectionsModule {}
