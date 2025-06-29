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

    async findUnique(where: Prisma.ReportWhereUniqueInput) {
        return this.prisma.report.findUnique({
            where,
        });
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
