import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/auth.dto";
import { Prisma, UserRole } from "@prisma/client";
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

    async register({
        registerData,
        ssoProvider = undefined,
    }: {
        registerData: RegisterDto;
        ssoProvider?: string;
    }) {
        const { role, email, ...user } = registerData;

        const createdUser = await (
            role === UserRole.STUDENT
                ? this.studentsService
                : this.teachersService
        ).create({
            user: {
                create: {
                    ...user,
                    email,
                    role,
                    ...(ssoProvider
                        ? {
                              emails: {
                                  create: {
                                      email,
                                      ssoProvider,
                                  },
                              },
                          }
                        : {}),
                },
            },
        });

        if (!ssoProvider) {
            return createdUser;
        }

        const foundUser = await this.usersService.findUnique({
            id: createdUser.userId,
        });

        return this.login(foundUser!);
    }

    async login(
        user: Prisma.UserGetPayload<{
            include: {
                student: true;
                teacher: true;
            };
        }>,
    ) {
        const sub =
            user.role === UserRole.STUDENT
                ? user.student?.id
                : user.teacher?.id;

        const payload = { sub, scope: user.role };

        return {
            accessToken: await this.jwtService.signAsync(payload),
            userRole: user.role,
        };
    }
}
