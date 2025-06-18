import { ProjectGroup } from "@prisma/client";

export class ReportEntity {
    id: string;
    content: string;
    created_at: Date;
    updated_at: Date;
    projectGroup: ProjectGroup;

    constructor(partial: Partial<ReportEntity>) {
        Object.assign(this, partial);
    }
}
