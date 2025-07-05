import { Type } from "class-transformer";
import { ProjectGroupEntity } from "src/project-groups/entities/project-group.entity";
import { ReportSectionEntity } from "src/report-sections/entities/report-section.entity";

export class ReportEntity {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    projectGroupId: string;
    createdByStudentId: string;
    reportSectionId: string;

    @Type(() => ProjectGroupEntity)
    projectGroup?: ProjectGroupEntity;

    @Type(() => ReportSectionEntity)
    reportSection?: ReportSectionEntity;

    constructor(partial: Partial<ReportEntity>) {
        Object.assign(this, partial);
    }
}
