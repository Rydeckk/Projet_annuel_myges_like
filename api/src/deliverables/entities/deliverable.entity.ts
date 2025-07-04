export class DeliverableEntity {
    id: string;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    projectGroupId: string;
    uploadedByStudentId: string;

    constructor(partial: Partial<DeliverableEntity>) {
        Object.assign(this, partial);
    }
}

export class DeliverableArchiveEntity {
    id: string;
    name: string;
    path: string;
    fileSize: number;
    createdAt: Date;
    updatedAt: Date;
    deliverableId: string;

    constructor(partial: Partial<DeliverableArchiveEntity>) {
        Object.assign(this, partial);
    }
}
