import { Type } from "class-transformer";
import { UserEntity } from "src/users/entities/user.entity";

export class TeacherEntity {
    id: string;
    userId: string;

    @Type(() => UserEntity)
    user?: UserEntity;

    constructor(partial: Partial<TeacherEntity>) {
        Object.assign(this, partial);
    }
}
