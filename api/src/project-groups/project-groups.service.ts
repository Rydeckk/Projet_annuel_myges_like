import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import {
    CreateProjectGroupDto,
    UpdateProjectGroupDto,
} from "./dto/project-group.dto";
import { UUID } from "crypto";

@Injectable()
export class ProjectGroupsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateProjectGroupDto) {
        return this.prisma.projectGroup.create({
            data,
        });
    }

    async update(
        projectGroupId: string,
        { selectedProjectGroupStudentIds = [], name }: UpdateProjectGroupDto,
    ) {
        const projectGroupsStudentIds = (
            await this.prisma.projectGroup.findMany({
                where: {
                    id: projectGroupId,
                },
                include: {
                    projectGroupStudents: true,
                },
            })
        ).flatMap(({ projectGroupStudents }) =>
            projectGroupStudents.map(({ studentId }) => studentId),
        );

        const oldProjectGroupStudentIds = (
            await this.prisma.projectGroupStudent.findMany({
                where: {
                    projectGroupId,
                },
            })
        ).map(({ studentId }) => studentId);

        const removeStudentsToProjectGroup = oldProjectGroupStudentIds.filter(
            (studentId: UUID) =>
                !selectedProjectGroupStudentIds.includes(studentId),
        );

        const createStudentsToProjectGroup = selectedProjectGroupStudentIds
            .filter(
                (studentId) =>
                    !projectGroupsStudentIds
                        .filter(
                            (studentId) =>
                                !removeStudentsToProjectGroup.includes(
                                    studentId,
                                ),
                        )
                        .includes(studentId),
            )
            .map((studentId) => ({
                studentId,
            }));

        return this.prisma.projectGroup.update({
            where: {
                id: projectGroupId,
            },
            data: {
                name,
                projectGroupStudents: {
                    createMany: {
                        data: createStudentsToProjectGroup,
                    },
                    deleteMany: {
                        studentId: {
                            in: removeStudentsToProjectGroup,
                        },
                    },
                },
            },
        });
    }

    async delete(projectGroupId: string) {
        return this.prisma.projectGroup.delete({
            where: {
                id: projectGroupId,
            },
        });
    }
}
