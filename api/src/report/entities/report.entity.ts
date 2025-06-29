export class ReportEntity {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    projectGroupId: string;

    constructor(partial: Partial<ReportEntity>) {
        Object.assign(this, partial);
    }
}
