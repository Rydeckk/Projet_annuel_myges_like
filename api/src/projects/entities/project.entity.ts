import { ProjectVisibility } from "@prisma/client";
import { Type } from "class-transformer";

export class ProjectEntity {
    id: string;
    name: string;
    description: string;
    fileName: string | null;
    path: string | null;
    fileSize: number | null;
    projectVisibility: ProjectVisibility;

    @Type(() => Date)
    createdAt: Date;

    @Type(() => Date)
    updatedAt: Date;

    createdByTeacherId: string;

    constructor(partial: Partial<ProjectEntity>) {
        Object.assign(this, partial);
    }
}
