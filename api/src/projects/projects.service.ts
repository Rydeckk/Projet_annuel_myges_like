import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateProjectDto, UpdateProjectDto } from "./dto/project.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class ProjectsService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(where: Prisma.ProjectWhereInput | undefined = undefined) {
        return this.prisma.project.findMany({
            where,
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async findUnique(where: Prisma.ProjectWhereUniqueInput) {
        return this.prisma.project.findUnique({
            where,
        });
    }

    async create(creatorId: string, data: CreateProjectDto) {
        return this.prisma.project.create({
            data: {
                ...data,
                createdByTeacherId: creatorId,
            },
        });
    }

    async update({
        createdByTeacherId,
        projectId,
        data,
    }: {
        createdByTeacherId: string;
        projectId: string;
        data: UpdateProjectDto;
    }) {
        return this.prisma.project.update({
            where: {
                id: projectId,
                createdByTeacherId,
            },
            data,
        });
    }

    async delete(projectId: string, teacherId: string) {
        return this.prisma.project.delete({
            where: {
                id: projectId,
                createdByTeacherId: teacherId,
            },
        });
    }
}
