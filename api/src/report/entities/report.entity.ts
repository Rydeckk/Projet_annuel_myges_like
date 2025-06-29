export class ReportEntity {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    projectGroupId: string;
    createdByStudentId: string;
    reportSectionId: string;

    constructor(partial: Partial<ReportEntity>) {
        Object.assign(this, partial);
    }
}
