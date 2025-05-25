import { Type } from "class-transformer";
import { UserEntity } from "src/users/entities/user.entity";

export class StudentEntity {
    id: string;
    userId: string;

    @Type(() => UserEntity)
    user?: UserEntity;

    constructor(partial: Partial<StudentEntity>) {
        Object.assign(this, partial);
    }
}
