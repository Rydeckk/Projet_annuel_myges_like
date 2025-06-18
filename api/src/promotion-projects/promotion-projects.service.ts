import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreatePromotionProjectDto } from "./dto/promotion-project.dto";

@Injectable()
export class PromotionProjectsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreatePromotionProjectDto) {
        return this.prisma.promotionProject.create({
            data,
        });
    }
}
