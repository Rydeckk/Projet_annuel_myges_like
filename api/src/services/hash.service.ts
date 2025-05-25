import { Injectable } from "@nestjs/common";
import { genSalt, hash } from "bcryptjs";

@Injectable()
export class HashService {
    async hashPassword(password: string) {
        const salt = await genSalt(10);
        return hash(password, salt);
    }
}
