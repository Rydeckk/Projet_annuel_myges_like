import { Injectable } from "@nestjs/common";
import { CreateReportDto } from "./dto/report.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class ReportService {
    constructor(private readonly prisma: PrismaService) {}

    async upsert(
        studentId: string,
        { content, projectGroupId, reportSectionId }: CreateReportDto,
    ) {
        return this.prisma.report.upsert({
            where: {
                projectGroupId_reportSectionId: {
                    projectGroupId,
                    reportSectionId,
                },
            },
            create: {
                content,
                projectGroupId,
                reportSectionId,
                createdByStudentId: studentId,
            },
            update: {
                content,
            },
        });
    }

    async findAll(where: Prisma.ReportWhereInput) {
        return this.prisma.report.findMany({
            where,
            include: {
                projectGroup: {
                    include: {
                        reports: true,
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
}
