import {
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { LoginDto, RegisterDto } from "./dto/auth.dto";
import { UserRole } from "@prisma/client";
import { hash, genSalt, compare } from "bcryptjs";
import { JWTPaylod } from "src/types/jwt-paylod";
import { StudentsService } from "src/students/students.service";
import { TeachersService } from "src/teachers/teachers.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly studentsService: StudentsService,
        private readonly teachersService: TeachersService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser({ sub, scope }: JWTPaylod) {
        return (
            scope === UserRole.STUDENT
                ? this.studentsService
                : this.teachersService
        ).findUnique({
            id: sub,
        });
    }

    async register({ email, password, role, ...user }: RegisterDto) {
        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);

        const existingUser = await this.usersService.findFirst({
            OR: [
                { email },
                {
                    emails: {
                        some: {
                            email,
                        },
                    },
                },
            ],
        });

        if (existingUser) {
            throw new HttpException(
                `The email ${email} already exists`,
                HttpStatus.CONFLICT,
            );
        }

        const data = {
            user: {
                create: {
                    ...user,
                    email,
                    password: hashedPassword,
                    role,
                },
            },
        };

        return (
            role === UserRole.STUDENT
                ? this.studentsService
                : this.teachersService
        ).create(data);
    }

    async login({ password, email }: LoginDto) {
        const user = await this.usersService.findUnique({ email });
        const isPasswordMatch = await compare(password, user?.password ?? "");

        if (!user || !isPasswordMatch) {
            throw new UnauthorizedException();
        }

        const sub =
            user.role === UserRole.STUDENT
                ? user.student?.id
                : user.teacher?.id;

        const payload = { sub, scope: user.role };

        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
