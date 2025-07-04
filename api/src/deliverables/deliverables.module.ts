import { Module } from "@nestjs/common";
import { DeliverablesService } from "./deliverables.service";
import { DeliverablesController } from "./deliverables.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { DeliverableRulesModule } from "src/deliverable-rules/deliverable-rules.module";
import { GoogleCloudStorageModule } from "src/google-cloud-storage/google-cloud-storage.module";

@Module({
    imports: [PrismaModule, DeliverableRulesModule, GoogleCloudStorageModule],
    controllers: [DeliverablesController],
    providers: [DeliverablesService],
    exports: [DeliverablesService],
})
export class DeliverablesModule {}
