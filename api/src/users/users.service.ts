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
                authProvider: true,
            },
        });
    }

    async update({
        where,
        data,
    }: {
        where: Prisma.UserWhereUniqueInput;
        data: Prisma.UserUpdateInput;
    }) {
        return this.prisma.user.update({
            where,
            data,
        });
    }

    async delete(userId: string) {
        return this.prisma.user.delete({
            where: {
                id: userId,
            },
        });
    }
}
