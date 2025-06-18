import { Body, Controller, Post, SerializeOptions } from "@nestjs/common";
import { PromotionProjectsService } from "./promotion-projects.service";
import { CreatePromotionProjectDto } from "./dto/promotion-project.dto";
import { PromotionProjectEntity } from "./entities/promotion-project.entity";

@Controller("promotion-projects")
export class PromotionProjectsController {
    constructor(
        private readonly promotionProjectsService: PromotionProjectsService,
    ) {}

    @Post()
    @SerializeOptions({ type: PromotionProjectEntity })
    async create(@Body() createPromotionProjectDto: CreatePromotionProjectDto) {
        return this.promotionProjectsService.create(createPromotionProjectDto);
    }
}
