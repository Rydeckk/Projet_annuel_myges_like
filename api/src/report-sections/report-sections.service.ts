import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import {
    CreateReportSectionsDto,
    UpdateReportSectionsDto,
} from "./dto/report-sections.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class ReportSectionsService {
    constructor(private readonly prisma: PrismaService) {}

    async getLastOrder(promotionProjectId: string) {
        const reportSectionFind = await this.prisma.reportSection.findFirst({
            where: {
                promotionProjectId,
            },
            orderBy: {
                order: "desc",
            },
        });

        return reportSectionFind ? reportSectionFind.order + 1 : 1;
    }

    async updateOrder(id: string, newOrder: number, isDelete: boolean = false) {
        const reportSectionUpdated = await this.prisma.reportSection.findUnique(
            {
                where: { id: id },
            },
        );

        if (!reportSectionUpdated) {
            throw new Error("Report section not found");
        }

        if (newOrder === reportSectionUpdated.order && isDelete === false) {
            return;
        }

        if (reportSectionUpdated.order < newOrder || isDelete) {
            await this.prisma.reportSection.updateMany({
                where: {
                    promotionProjectId: reportSectionUpdated.promotionProjectId,
                    order: isDelete
                        ? { gt: reportSectionUpdated.order }
                        : { gt: reportSectionUpdated.order, lte: newOrder },
                },
                data: {
                    order: { decrement: 1 },
                },
            });
        } else {
            await this.prisma.reportSection.updateMany({
                where: {
                    promotionProjectId: reportSectionUpdated.promotionProjectId,
                    order: {
                        gte: newOrder,
                        lt: reportSectionUpdated.order,
                    },
                },
                data: {
                    order: { increment: 1 },
                },
            });
        }
    }

    async create(teacherId: string, data: CreateReportSectionsDto) {
        const order = await this.getLastOrder(data.promotionProjectId);

        return this.prisma.reportSection.create({
            data: {
                ...data,
                order: order,
                teacherId: teacherId,
            },
        });
    }

    async findAll(where: Prisma.ReportSectionWhereInput) {
        return this.prisma.reportSection.findMany({
            where,
            orderBy: {
                order: "asc",
            },
            include: {
                reports: true,
            },
        });
    }

    async update(id: string, data: UpdateReportSectionsDto) {
        if (data.order) {
            await this.updateOrder(id, data.order);
        }

        return this.prisma.reportSection.update({
            where: { id: id },
            data: data,
        });
    }

    async delete(id: string) {
        const reportSection = await this.prisma.reportSection.findUnique({
            where: { id: id },
        });

        if (!reportSection) {
            throw new Error("Report section not found");
        }

        await this.updateOrder(id, reportSection.order, true);

        return this.prisma.reportSection.delete({
            where: { id: id },
        });
    }
}
