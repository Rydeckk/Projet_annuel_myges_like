import { Injectable } from "@nestjs/common";
import { CreateReportDto, UpdateReportDto } from "./dto/report.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class ReportService {
    constructor(private readonly prisma: PrismaService) {}

    async create(studentId: string, data: CreateReportDto) {
        return this.prisma.report.create({
            data: {
                ...data,
                createdByStudentId: studentId,
            },
        });
    }

    async findAll(where: Prisma.ReportWhereInput) {
        return this.prisma.report.findMany({
            where,
            include: {
                projectGroup: {
                    include: {
                        report: true,
                        projectGroupStudents: {
                            include: {
                                student: {
                                    include: {
                                        user: true,
                                    },
                                },
                            },
                        },
                    },
                },
                reportSection: {
                    include: {
                        promotionProject: {
                            include: {
                                promotion: true,
                                project: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                reportSection: {
                    order: "asc",
                },
            },
        });
    }

    async findUnique(where: Prisma.ReportWhereUniqueInput) {
        return this.prisma.report.findUnique({
            where,
        });
    }

    async getContent(
        promotionId: string,
        projectName: string,
        projectGroupName: string,
        reportSectionName: string | null,
    ) {
        const projectGroup = await this.prisma.projectGroup.findFirst({
            where: {
                promotionProject: {
                    project: {
                        name: projectName,
                    },
                    promotionId: promotionId,
                },
                name: projectGroupName,
            },
        });

        if (!projectGroup) {
            return "";
        }

        const reports = await this.prisma.report.findMany({
            where: {
                projectGroupId: projectGroup.id,
                ...(reportSectionName && {
                    reportSection: {
                        title: reportSectionName,
                    },
                }),
            },
            include: {
                reportSection: true,
            },
            orderBy: {
                reportSection: {
                    order: "asc",
                },
            },
        });

        return {
            content: reports.map((report) => report.content).join("\n\n"),
        };
    }

    async update(id: string, data: UpdateReportDto) {
        return this.prisma.report.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        return this.prisma.report.delete({
            where: { id },
        });
    }
}
