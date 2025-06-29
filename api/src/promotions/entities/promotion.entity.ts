import { Type } from "class-transformer";
import { PromotionStudentEntity } from "./promotion-student.entity";
import { PromotionProjectEntity } from "src/promotion-projects/entities/promotion-project.entity";

export class PromotionEntity {
    id: string;
    name: string;

    @Type(() => Date)
    startDate: Date;

    @Type(() => Date)
    endDate: Date;

    @Type(() => Date)
    createdAt: Date;

    @Type(() => Date)
    updatedAt: Date;

    createdByTeacherId: string;

    @Type(() => PromotionStudentEntity)
    promotionStudents?: PromotionStudentEntity[];

    @Type(() => PromotionProjectEntity)
    promotionProjects?: PromotionProjectEntity[];

    constructor(partial: Partial<PromotionEntity>) {
        Object.assign(this, partial);
    }
}
