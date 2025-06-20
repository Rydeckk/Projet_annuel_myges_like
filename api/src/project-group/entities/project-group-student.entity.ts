import { Type } from "class-transformer";
import { IsNotEmpty, IsUUID } from "class-validator";
import { ProjectGroupEntity } from "./project-group.entity";
import { StudentEntity } from "src/students/entities/student.entity";

export class ProjectGroupStudentEntity {
    @IsUUID()
    @IsNotEmpty()
    projectGroupId: string;

    @IsNotEmpty()
    @IsUUID()
    studentId: string;

    @Type(() => ProjectGroupEntity)
    projectGroup: ProjectGroupEntity;

    @Type(() => StudentEntity)
    student: StudentEntity;

    constructor(partial: Partial<ProjectGroupStudentEntity>) {
        Object.assign(this, partial);
    }
}
