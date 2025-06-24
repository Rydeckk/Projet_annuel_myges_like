import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import {
    CreateProjectGroupStudentDto,
    DeleteProjectGroupStudentDto,
} from "./dto/project-group-student.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class ProjectGroupStudentsService {
    constructor(private readonly prisma: PrismaService) {}

    async findFirst<T extends Prisma.ProjectGroupStudentInclude>({
        where,
        include = {} as T,
    }: {
        where: Prisma.ProjectGroupStudentWhereInput;
        include?: T;
    }): Promise<Prisma.ProjectGroupStudentGetPayload<{ include: T }> | null> {
        return this.prisma.projectGroupStudent.findFirst({
            where,
            include,
        });
    }

    async create(data: CreateProjectGroupStudentDto) {
        return this.prisma.projectGroupStudent.create({
            data,
        });
    }

    async delete({ projectGroupId, studentId }: DeleteProjectGroupStudentDto) {
        return this.prisma.projectGroupStudent.delete({
            where: {
                projectGroupId_studentId: {
                    studentId,
                    projectGroupId,
                },
            },
        });
    }
}
