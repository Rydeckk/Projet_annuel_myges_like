import { Module } from "@nestjs/common";
import { PromotionsService } from "./promotions.service";
import { PromotionsController } from "./promotions.controller";
import { HashService } from "src/services/hash.service";
import { EmailService } from "src/services/email.service";

@Module({
    controllers: [PromotionsController],
    providers: [PromotionsService, HashService, EmailService],
})
export class PromotionsModule {}
