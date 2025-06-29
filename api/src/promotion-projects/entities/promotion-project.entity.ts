import { MalusTimeType, ProjectGroupRule } from "@prisma/client";
import { Type } from "class-transformer";
import { ProjectGroupEntity } from "src/project-groups/entities/project-group.entity";
import { ProjectEntity } from "src/projects/entities/project.entity";

export class PromotionProjectEntity {
    id: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    minPerGroup: number;
    maxPerGroup: number;
    malus: number | null;
    malusTimeType: MalusTimeType | null;
    allowLateSubmission: boolean;
    isReportRequired: boolean;
    projectGroupRule: ProjectGroupRule;
    startDate: Date;
    endDate: Date;

    projectId: string;
    promotionId: string;

    @Type(() => ProjectEntity)
    project?: ProjectEntity;

    @Type(() => ProjectGroupEntity)
    projectGroups?: ProjectGroupEntity[];

    constructor(partial: Partial<PromotionProjectEntity>) {
        Object.assign(this, partial);
    }
}
