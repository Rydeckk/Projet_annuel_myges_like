import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    SerializeOptions,
} from "@nestjs/common";
import { PromotionsService } from "./promotions.service";
import { CreatePromotionDto, UpdatePromotionDto } from "./dto/promotion.dto";
import { GetCurrentUser, UserWithDetails } from "src/decorators/user.decorator";
import { CreatePromotionStudentDto } from "./dto/promotion-student.dto";
import { PromotionEntity } from "./entities/promotion.entity";
import { StudentEntity } from "src/students/entities/student.entity";

@Controller("promotions")
export class PromotionsController {
    constructor(private readonly promotionsService: PromotionsService) {}

    @Get()
    @SerializeOptions({ type: PromotionEntity })
    async findAll(@Query("name") name: string) {
        if (name) {
            const foundPromotion = await this.promotionsService.findFirst({
                name,
            });

            if (!foundPromotion) {
                throw new NotFoundException();
            }

            return foundPromotion;
        }

        return this.promotionsService.findAll();
    }

    @Post()
    @SerializeOptions({ type: PromotionEntity })
    async create(
        @GetCurrentUser() user: UserWithDetails,
        @Body() promotion: CreatePromotionDto,
    ) {
        return this.promotionsService.create(promotion, user.id);
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
            data: promotion,
            promotionId,
        });
    }

    @Delete(":id")
    @SerializeOptions({ type: PromotionEntity })
    async delete(@Param("id") promotionId: string) {
        return this.promotionsService.delete(promotionId);
    }
}
