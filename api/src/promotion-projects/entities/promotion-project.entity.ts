import { ProjectGroupRule } from "@prisma/client";

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

    constructor(partial: Partial<PromotionProjectEntity>) {
        Object.assign(this, partial);
    }
}
