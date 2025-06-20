export class CreateProjectGroupStudentDto {
    projectGroupId: string;
    studentId: string;

    constructor(partial: Partial<CreateProjectGroupStudentDto>) {
        Object.assign(this, partial);
    }
}
