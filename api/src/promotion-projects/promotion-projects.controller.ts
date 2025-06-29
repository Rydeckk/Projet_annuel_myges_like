import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    SerializeOptions,
} from "@nestjs/common";
import { PromotionProjectsService } from "./promotion-projects.service";
import {
    CreatePromotionProjectDto,
    UpdatePromotionProjectDto,
} from "./dto/promotion-project.dto";
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

    @Put(":id")
    @SerializeOptions({ type: PromotionProjectEntity })
    async update(
        @Param("id", ParseUUIDPipe) id: string,
        @Body() updatePromotionProjectDto: UpdatePromotionProjectDto,
    ) {
        return this.promotionProjectsService.update(
            id,
            updatePromotionProjectDto,
        );
    }

    @Get("teacher/project/:name")
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
                createdByTeacherId: userScopeId,
            },
        });
    }

    @Get("student/project/:name")
    @SerializeOptions({ type: PromotionProjectEntity })
    async studentFindByProjectName(
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

    @Delete(":id")
    @SerializeOptions({ type: PromotionProjectEntity })
    async delete(@Param("id", ParseUUIDPipe) id: string) {
        return this.promotionProjectsService.delete({
            id,
        });
    }
}
