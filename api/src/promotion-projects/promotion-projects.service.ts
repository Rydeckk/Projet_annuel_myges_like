import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreatePromotionProjectDto } from "./dto/promotion-project.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class PromotionProjectsService {
    constructor(private readonly prisma: PrismaService) {}

    async findMany(where: Prisma.PromotionProjectWhereInput) {
        return this.prisma.promotionProject.findMany({
            where,
            include: {
                project: true,
            },
        });
    }

    async create(data: CreatePromotionProjectDto) {
        return this.prisma.promotionProject.create({
            data,
        });
    }
}
