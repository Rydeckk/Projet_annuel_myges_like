import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class StudentsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: Prisma.StudentCreateInput) {
        return this.prisma.student.create({
            data,
        });
    }

    async findUnique(where: Prisma.StudentWhereUniqueInput) {
        return this.prisma.student.findUnique({
            where,
            include: {
                user: true,
            },
        });
    }
}
