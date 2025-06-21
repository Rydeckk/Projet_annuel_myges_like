import { MalusTimeType, ProjectGroupRule } from "@prisma/client";
import { Type } from "class-transformer";
import { ProjectGroupEntity } from "src/project-groups/entities/project-group.entity";
import { ProjectEntity } from "src/projects/entities/project.entity";

export class PromotionProjectEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    minPerGroup: number;
    maxPerGroup: number;
    malus: number | null;
    malusTimeType: MalusTimeType | null;

    allowLateSubmission: boolean;
    projectGroupRule: ProjectGroupRule;

    projectId: string;
    promotionId: string;

    @Type(() => Date)
    startDate: Date;

    @Type(() => Date)
    endDate: Date;

    @Type(() => ProjectEntity)
    project?: ProjectEntity;

    @Type(() => ProjectGroupEntity)
    projectGroups?: ProjectGroupEntity[];

    constructor(partial: Partial<PromotionProjectEntity>) {
        Object.assign(this, partial);
    }
}
