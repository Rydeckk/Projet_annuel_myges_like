import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async findFirst(where: Prisma.UserWhereInput) {
        return this.prisma.user.findFirst({
            where,
            include: {
                student: true,
                teacher: true,
            },
        });
    }

    async findUnique(where: Prisma.UserWhereUniqueInput) {
        return this.prisma.user.findUnique({
            where,
            include: {
                student: true,
                teacher: true,
            },
        });
    }
}
