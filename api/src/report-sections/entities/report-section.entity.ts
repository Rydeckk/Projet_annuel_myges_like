import { Type } from "class-transformer";
import { PromotionProjectEntity } from "src/promotion-projects/entities/promotion-project.entity";
import { ReportEntity } from "src/report/entities/report.entity";

export class ReportSectionEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    order: number;
    promotionProjectId: string;
    teacherId: string;

    @Type(() => ReportEntity)
    reports?: ReportEntity[];

    @Type(() => PromotionProjectEntity)
    promotionProject?: PromotionProjectEntity;

    constructor(partial: Partial<ReportSectionEntity>) {
        Object.assign(this, partial);
    }
}
