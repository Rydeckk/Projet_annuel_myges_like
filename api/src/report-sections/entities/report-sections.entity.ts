export class ReportSectionsEntity {
    id: string;
    title: string;
    description?: string;
    promotionProjectId: string;
    teacherId: string;

    constructor(partial: Partial<ReportSectionsEntity>) {
        Object.assign(this, partial);
    }
}
