import { Injectable } from "@nestjs/common";
import {
    CreateAllProjectGroupsDto,
    CreateProjectGroupDto,
    CreateProjectGroupStudentDto,
} from "./dto/project-group.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma, Student } from "@prisma/client";
import { shuffleArray } from "src/utils/utils";

@Injectable()
export class ProjectGroupService {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateProjectGroupDto) {
        return this.prisma.projectGroup.create({
            data,
        });
    }

    async createAllProjectGroups(data: CreateAllProjectGroupsDto) {
        const promotionProject = await this.prisma.promotionProject.findUnique({
            where: {
                id: data.promotionProjectId,
            },
            include: {
                project: true,
                promotion: {
                    include: {
                        promotionStudents: {
                            include: {
                                student: true,
                            },
                        },
                    },
                },
            },
        });

        if (!promotionProject) {
            throw new Error("Promotion project not found");
        }

        const nbGroups =
            Math.floor(
                promotionProject.promotion.promotionStudents.length /
                    promotionProject.maxPerGroup,
            ) + 1;

        const groupsData = Array.from({ length: nbGroups }, (_, i) => ({
            promotionProjectId: promotionProject.id,
            name: `Groupe ${i + 1}`,
        }));

        const projectGroupsCreated =
            await this.prisma.projectGroup.createManyAndReturn({
                data: groupsData,
            });

        if (promotionProject.projectGroupRule === "RANDOM") {
            const students = promotionProject.promotion.promotionStudents.map(
                (promotionStudent) => promotionStudent.student,
            );

            const shuffledStudents = shuffleArray(students);

            const groups: Student[][] = Array.from(
                { length: nbGroups },
                () => [],
            );

            shuffledStudents.forEach((student, index) => {
                groups[index % nbGroups].push(student);
            });

            for (let i = 0; i < groups.length; i++) {
                const group = groups[i];
                const projectGroupId = projectGroupsCreated[i].id;

                await this.prisma.projectGroupStudent.createMany({
                    data: group.map((student) => ({
                        projectGroupId,
                        studentId: student.id,
                    })),
                });
            }
        }

        return projectGroupsCreated;
    }

    async createProjectGroupStudent(data: CreateProjectGroupStudentDto) {
        return this.prisma.projectGroupStudent.create({
            data,
        });
    }

    async findMany(where: Prisma.ProjectGroupWhereInput) {
        return this.prisma.projectGroup.findMany({
            where,
            include: {
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
        });
    }

    async findMyProjectGroup(promotionProjectId: string, userScopeId: string) {
        return this.prisma.projectGroup.findFirst({
            where: {
                projectGroupStudents: {
                    some: {
                        student: {
                            id: userScopeId,
                        },
                    },
                },
                promotionProjectId,
            },
            include: {
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
        });
    }
}
