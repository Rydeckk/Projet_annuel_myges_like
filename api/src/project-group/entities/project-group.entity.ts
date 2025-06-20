import { Type } from "class-transformer";
import { PromotionProjectEntity } from "src/promotion-projects/entities/promotion-project.entity";

export class ProjectGroupEntity {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    promotionProjectId: string;

    @Type(() => PromotionProjectEntity)
    promotionProject: PromotionProjectEntity;

    constructor(partial: Partial<ProjectGroupEntity>) {
        Object.assign(this, partial);
    }
}
