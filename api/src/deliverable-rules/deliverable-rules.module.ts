import { Module } from "@nestjs/common";
import { DeliverableRulesController } from "./deliverable-rules.controller";
import { DeliverableRulesService } from "./deliverable-rules.service";
import { DeliverableValidationService } from "./deliverable-validation.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [DeliverableRulesController],
    providers: [DeliverableRulesService, DeliverableValidationService],
    exports: [DeliverableRulesService, DeliverableValidationService],
})
export class DeliverableRulesModule {}
