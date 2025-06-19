import { Body, Controller, Get, Post, SerializeOptions } from "@nestjs/common";
import { PromotionProjectsService } from "./promotion-projects.service";
import { CreatePromotionProjectDto } from "./dto/promotion-project.dto";
import { PromotionProjectEntity } from "./entities/promotion-project.entity";
import { GetCurrentUser } from "decorators/user.decorator";

@Controller("promotion-projects")
export class PromotionProjectsController {
    constructor(
        private readonly promotionProjectsService: PromotionProjectsService,
    ) {}

    @Get("student")
    @SerializeOptions({ type: PromotionProjectEntity })
    async findStudentProjects(@GetCurrentUser("id") userScopeId: string) {
        return this.promotionProjectsService.findMany({
            promotion: {
                promotionStudents: {
                    some: {
                        studentId: userScopeId,
                    },
                },
            },
        });
    }

    @Post()
    @SerializeOptions({ type: PromotionProjectEntity })
    async create(@Body() createPromotionProjectDto: CreatePromotionProjectDto) {
        return this.promotionProjectsService.create(createPromotionProjectDto);
    }
}
