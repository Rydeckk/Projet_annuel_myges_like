import { Controller, Get } from "@nestjs/common";
import { Public } from "src/auth/auth.guard";

@Controller("users")
export class UserController {
    @Public()
    @Get()
    findAll() {
        return [];
    }
}
