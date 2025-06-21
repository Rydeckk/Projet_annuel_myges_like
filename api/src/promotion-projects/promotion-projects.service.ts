import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreatePromotionProjectDto } from "./dto/promotion-project.dto";
import {
    Prisma,
    ProjectGroup,
    ProjectGroupRule,
    Student,
} from "@prisma/client";
import { shuffleArray } from "src/utils/utils";
import { PrismaTX } from "types/prisma";

@Injectable()
export class PromotionProjectsService {
    constructor(private readonly prisma: PrismaService) {}

    async findMany(where: Prisma.PromotionProjectWhereInput) {
        return this.prisma.promotionProject.findMany({
            where,
            include: {
                project: true,
            },
        });
    }

    private async assignStudentToProjectGroupRandomly({
        students,
        projectGroupsCreated,
        minPerGroup,
        maxPerGroup,
        totalGroups,
        tx,
    }: {
        students: Student[];
        projectGroupsCreated: ProjectGroup[];
        minPerGroup: number;
        maxPerGroup: number;
        totalGroups: number;
        tx: PrismaTX;
    }) {
        const shuffledStudents = shuffleArray(students);

        const { projectGroupStudents } = projectGroupsCreated.reduce(
            (acc, projectGroup, i) => {
                const remainingStudents =
                    shuffledStudents.length - acc.assignedStudentsCount;

                const remainingGroups = totalGroups - i;

                const actualGroupSize = Math.min(
                    maxPerGroup,
                    Math.max(
                        minPerGroup,
                        Math.ceil(remainingStudents / remainingGroups),
                    ),
                );

                return {
                    ...acc,
                    projectGroupStudents: [
                        ...acc.projectGroupStudents,
                        ...shuffledStudents
                            .slice(acc.assignedStudentsCount)
                            .slice(0, actualGroupSize)
                            .map(({ id }) => ({
                                studentId: id,
                                projectGroupId: projectGroup.id,
                            })),
                    ],
                    assignedStudentsCount:
                        acc.assignedStudentsCount + actualGroupSize,
                };
            },
            {
                projectGroupStudents: [],
                assignedStudentsCount: 0,
            },
        );

        await tx.projectGroupStudent.createMany({
            data: projectGroupStudents,
        });
    }

    async create(data: CreatePromotionProjectDto) {
        return this.prisma.$transaction(async (tx) => {
            const { promotion, ...createdPromotionProject } =
                await tx.promotionProject.create({
                    data,
                    include: {
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

            const { promotionStudents } = promotion;

            const { minPerGroup, maxPerGroup, projectGroupRule } =
                createdPromotionProject;

            const totalGroups = Math.min(
                Math.floor(promotionStudents.length / maxPerGroup) + 1,
                Math.floor(promotionStudents.length / minPerGroup),
            );

            const projectGroupsCreated =
                await tx.projectGroup.createManyAndReturn({
                    data: Array.from({ length: totalGroups }).map((_, i) => ({
                        promotionProjectId: createdPromotionProject.id,
                        name: `Group ${i + 1}`,
                    })),
                });

            if (projectGroupRule === ProjectGroupRule.RANDOM) {
                const students = promotionStudents.map(
                    ({ student }) => student,
                );

                await this.assignStudentToProjectGroupRandomly({
                    students,
                    projectGroupsCreated,
                    minPerGroup,
                    maxPerGroup,
                    totalGroups,
                    tx,
                });
            }

            return createdPromotionProject;
        });
    }

    async findFirst(where: Prisma.PromotionProjectWhereInput) {
        return this.prisma.promotionProject.findFirst({
            where,
            include: {
                project: true,
                projectGroups: {
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
                },
            },
        });
    }
}
