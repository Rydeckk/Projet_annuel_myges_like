import { Injectable } from "@nestjs/common";
import { CreateReportDto, UpdateReportDto } from "./dto/report.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ReportService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createReportDto: CreateReportDto) {
        return this.prisma.report.create({
            data: { ...createReportDto },
        });
    }

    findAll() {
        return `This action returns all report`;
    }

    async findOne(id: string) {
        return this.prisma.report.findUnique({
            where: { id },
        });
    }

    async findByProjectGroupId(projectGroupId: string) {
        return this.prisma.report.findMany({
            where: { projectGroupId },
        });
    }

    async update(id: string, updateReportDto: UpdateReportDto) {
        return this.prisma.report.update({
            where: { id },
            data: { ...updateReportDto },
        });
    }

    remove(id: string) {
        return this.prisma.report.delete({
            where: { id },
        });
    }
}
