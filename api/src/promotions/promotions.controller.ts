import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    SerializeOptions,
} from "@nestjs/common";
import { PromotionsService } from "./promotions.service";
import { CreatePromotionDto, UpdatePromotionDto } from "./dto/promotion.dto";
import { GetCurrentUser } from "src/decorators/user.decorator";
import { CreatePromotionStudentDto } from "./dto/promotion-student.dto";
import { PromotionEntity } from "./entities/promotion.entity";
import { StudentEntity } from "src/students/entities/student.entity";

@Controller("promotions")
export class PromotionsController {
    constructor(private readonly promotionsService: PromotionsService) {}

    @Get(":name")
    @SerializeOptions({ type: PromotionEntity })
    async findByPromotionName(@Param("name") name: string) {
        return this.promotionsService.findFirst({
            name,
        });
    }

    @Get()
    @SerializeOptions({ type: PromotionEntity })
    async findAll() {
        return this.promotionsService.findAll();
    }

    @Post()
    @SerializeOptions({ type: PromotionEntity })
    async create(
        @GetCurrentUser("id") userScopeId: string,
        @Body() promotion: CreatePromotionDto,
    ) {
        return this.promotionsService.create(userScopeId, promotion);
    }

    @Post("students")
    @SerializeOptions({ type: StudentEntity })
    async createStudentToPromotion(
        @Body() promotionStudents: CreatePromotionStudentDto[],
    ) {
        return this.promotionsService.createStudentToPromotion(
            promotionStudents,
        );
    }

    @Put(":id")
    @SerializeOptions({ type: PromotionEntity })
    async update(
        @Param("id") promotionId: string,
        @Body() promotion: UpdatePromotionDto,
    ) {
        return this.promotionsService.update({
            promotionId,
            data: promotion,
        });
    }

    @Delete(":id")
    @SerializeOptions({ type: PromotionEntity })
    async delete(@Param("id") promotionId: string) {
        return this.promotionsService.delete(promotionId);
    }
}
