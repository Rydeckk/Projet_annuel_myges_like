import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class TeachersService {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: Prisma.TeacherCreateInput) {
        return this.prisma.teacher.create({
            data,
        });
    }

    async findUnique(where: Prisma.TeacherWhereUniqueInput) {
        return this.prisma.teacher.findUnique({
            where,
            include: {
                user: true,
            },
        });
    }
}
