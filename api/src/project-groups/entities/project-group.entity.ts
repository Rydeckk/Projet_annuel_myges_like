import { Type } from "class-transformer";
import { ProjectGroupStudentEntity } from "./project-group-student.entity";

export class ProjectGroupEntity {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;

    promotionProjectId: string;

    @Type(() => ProjectGroupStudentEntity)
    projectGroupStudents?: ProjectGroupStudentEntity[];

    constructor(partial: Partial<ProjectGroupEntity>) {
        Object.assign(this, partial);
    }
}
