import {
    Body,
    Controller,
    Delete,
    Param,
    Put,
    SerializeOptions,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserEntity } from "./entities/user.entity";
import { UpdateUserDto } from "./dto/user.dto";

@Controller("users")
export class UserController {
    constructor(private readonly usersService: UsersService) {}

    @Put(":id")
    @SerializeOptions({ type: UserEntity })
    async update(@Param("id") id: string, @Body() data: UpdateUserDto) {
        return this.usersService.update({
            where: {
                id,
            },
            data,
        });
    }

    @Delete(":id")
    @SerializeOptions({ type: UserEntity })
    async delete(@Param("id") id: string) {
        return this.usersService.delete(id);
    }
}
