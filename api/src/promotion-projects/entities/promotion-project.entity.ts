import { ProjectGroupRule } from "@prisma/client";
import { Type } from "class-transformer";
import { ProjectEntity } from "src/projects/entities/project.entity";

export class PromotionProjectEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    promotionId: string;
    minPerGroup: number;
    maxPerGroup: number;
    malus: number | null;
    malusPerTime: Date | null;
    allowLateSubmission: boolean;
    projectGroupRule: ProjectGroupRule;
    projectId: string;

    @Type(() => ProjectEntity)
    project: ProjectEntity;

    constructor(partial: Partial<PromotionProjectEntity>) {
        Object.assign(this, partial);
    }
}
