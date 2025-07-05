import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import {
    CreateReportSectionsDto,
    DeleteReportSectionDto,
    UpdateReportSectionsDto,
} from "./dto/report-section.dto";

@Injectable()
export class ReportSectionsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(teacherId: string, data: CreateReportSectionsDto) {
        const aboveOneLastOrder =
            (await this.prisma.reportSection.count({
                where: {
                    createdByTeacher: {
                        id: teacherId,
                    },
                    promotionProject: {
                        id: data.promotionProjectId,
                    },
                },
            })) + 1;

        return this.prisma.reportSection.create({
            data: {
                ...data,
                order: aboveOneLastOrder,
                teacherId,
            },
        });
    }

    async update(
        reportSectionId: string,
        teacherId: string,
        { promotionProjectId, ...data }: UpdateReportSectionsDto,
    ) {
        const promotionReportSections =
            await this.prisma.reportSection.findMany({
                where: {
                    promotionProjectId,
                    teacherId,
                },
                orderBy: {
                    order: "asc",
                },
            });

        const currentReportSectionIndex = promotionReportSections.findIndex(
            ({ id }) => id === reportSectionId,
        );

        const isOrderHigherThanCurrent =
            data.order >
            promotionReportSections[currentReportSectionIndex].order;

        const isOrderLowerThanCurrent =
            data.order <
            promotionReportSections[currentReportSectionIndex].order;

        const previousReportSection =
            promotionReportSections[currentReportSectionIndex - 1];

        const nextReportSection =
            promotionReportSections[currentReportSectionIndex + 1];

        return this.prisma.$transaction(async (tx) => {
            if (isOrderLowerThanCurrent) {
                await tx.reportSection.update({
                    where: { id: previousReportSection.id },
                    data: {
                        order: Math.min(
                            promotionReportSections.length,
                            previousReportSection.order + 1,
                        ),
                    },
                });
            }

            if (isOrderHigherThanCurrent) {
                await tx.reportSection.update({
                    where: { id: nextReportSection.id },
                    data: {
                        order: Math.max(nextReportSection.order - 1, 1),
                    },
                });
            }

            return tx.reportSection.update({
                where: { id: reportSectionId },
                data,
            });
        });
    }

    async delete(
        reportSectionId: string,
        teacherId: string,
        { promotionProjectId }: DeleteReportSectionDto,
    ) {
        const promotionReportSections =
            await this.prisma.reportSection.findMany({
                where: {
                    promotionProjectId,
                    teacherId,
                },
                orderBy: {
                    order: "asc",
                },
            });

        const currentReportSectionIndex = promotionReportSections.findIndex(
            ({ id }) => id === reportSectionId,
        );

        const slicedReportSections = promotionReportSections
            .slice(currentReportSectionIndex + 1)
            .map(({ id }) => id);

        return this.prisma.$transaction(async (tx) => {
            await tx.reportSection.updateMany({
                where: {
                    promotionProjectId,
                    id: { in: slicedReportSections },
                },
                data: {
                    order: {
                        decrement: 1,
                    },
                },
            });

            return tx.reportSection.delete({
                where: { id: reportSectionId },
            });
        });
    }
}
