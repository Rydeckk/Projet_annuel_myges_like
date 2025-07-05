import { ProjectVisibility } from "@prisma/client";

export class ProjectEntity {
    id: string;
    name: string;
    description: string | null;
    fileName: string | null;
    path: string | null;
    fileSize: number | null;
    projectVisibility: ProjectVisibility;
    createdAt: Date;
    updatedAt: Date;

    createdByTeacherId: string;

    constructor(partial: Partial<ProjectEntity>) {
        Object.assign(this, partial);
    }
}
