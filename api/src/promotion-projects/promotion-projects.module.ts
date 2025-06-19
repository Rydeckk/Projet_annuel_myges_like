import { Module } from "@nestjs/common";
import { PromotionProjectsService } from "./promotion-projects.service";
import { PromotionProjectsController } from "./promotion-projects.controller";

@Module({
    controllers: [PromotionProjectsController],
    providers: [PromotionProjectsService],
})
export class PromotionProjectsModule {}
