import { Controller } from "@nestjs/common";
import { PromotionProjectsService } from "./promotion-projects.service";

@Controller("promotion-projects")
export class PromotionProjectsController {
    constructor(
        private readonly promotionProjectsService: PromotionProjectsService,
    ) {}
}
