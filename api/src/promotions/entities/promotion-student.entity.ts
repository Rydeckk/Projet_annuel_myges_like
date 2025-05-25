import { Type } from "class-transformer";
import { StudentEntity } from "src/students/entities/student.entity";

export class PromotionStudentEntity {
    studentId: string;
    promotionId: string;
    createdAt: Date;

    @Type(() => StudentEntity)
    student?: StudentEntity;

    constructor(partial: Partial<PromotionStudentEntity>) {
        Object.assign(this, partial);
    }
}
