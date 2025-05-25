import { Module } from "@nestjs/common";
import { PromotionsService } from "./promotions.service";
import { PromotionsController } from "./promotions.controller";
import { HashService } from "src/services/hash.service";

@Module({
    controllers: [PromotionsController],
    providers: [PromotionsService, HashService],
})
export class PromotionsModule {}
