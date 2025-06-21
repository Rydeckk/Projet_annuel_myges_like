import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    SerializeOptions,
} from "@nestjs/common";
import { PromotionProjectsService } from "./promotion-projects.service";
import { CreatePromotionProjectDto } from "./dto/promotion-project.dto";
import { PromotionProjectEntity } from "./entities/promotion-project.entity";
import { GetCurrentUser } from "decorators/user.decorator";

@Controller("promotion-projects")
export class PromotionProjectsController {
    constructor(
        private readonly promotionProjectsService: PromotionProjectsService,
    ) {}

    @Get("current-student")
    @SerializeOptions({ type: PromotionProjectEntity })
    async findCurrentStudentPromotionProjects(
        @GetCurrentUser("id") userScopeId: string,
    ) {
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

    @Get("project/:name")
    @SerializeOptions({ type: PromotionProjectEntity })
    async findByProjectName(
        @GetCurrentUser("id") userScopeId: string,
        @Param("name") projectName: string,
    ) {
        return this.promotionProjectsService.findFirst({
            project: {
                name: projectName,
            },
            promotion: {
                promotionStudents: {
                    some: {
                        student: {
                            id: userScopeId,
                        },
                    },
                },
            },
        });
    }
}
