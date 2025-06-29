import { Type } from "class-transformer";
import { StudentEntity } from "src/students/entities/student.entity";

export class ProjectGroupStudentEntity {
    studentId: string;
    projectGroupId: string;
    createdAt: Date;

    @Type(() => StudentEntity)
    student?: StudentEntity;

    constructor(partial: Partial<ProjectGroupStudentEntity>) {
        Object.assign(this, partial);
    }
}
