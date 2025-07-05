import { Type } from "class-transformer";
import { ProjectGroupStudentEntity } from "../../project-group-students/entities/project-group-student.entity";
import { ReportEntity } from "src/report/entities/report.entity";

export class ProjectGroupEntity {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;

    promotionProjectId: string;

    @Type(() => ReportEntity)
    reports: ReportEntity[];

    @Type(() => ProjectGroupStudentEntity)
    projectGroupStudents?: ProjectGroupStudentEntity[];

    constructor(partial: Partial<ProjectGroupEntity>) {
        Object.assign(this, partial);
    }
}
