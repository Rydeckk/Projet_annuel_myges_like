import { Type } from "class-transformer";
import { PromotionStudentEntity } from "./promotion-student.entity";

export class PromotionEntity {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
    createdByTeacherId: string;

    @Type(() => PromotionStudentEntity)
    promotionStudents?: PromotionStudentEntity[];

    constructor(partial: Partial<PromotionEntity>) {
        Object.assign(this, partial);
    }
}
