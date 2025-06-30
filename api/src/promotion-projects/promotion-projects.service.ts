import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import {
    CreatePromotionProjectDto,
    UpdatePromotionProjectDto,
} from "./dto/promotion-project.dto";
import { Prisma, ProjectGroupRule, PromotionProject } from "@prisma/client";
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
        promotion,
        promotionProject,
        tx,
    }: {
        promotion: Prisma.PromotionGetPayload<{
            include: {
                promotionStudents: {
                    include: {
                        student: true;
                    };
                };
            };
        }>;
        promotionProject: PromotionProject;
        tx: PrismaTX;
    }) {
        const {
            id: promotionProjectId,
            minPerGroup,
            maxPerGroup,
        } = promotionProject;
        const { promotionStudents } = promotion;

        const totalGroups = Math.min(
            Math.floor(promotionStudents.length / maxPerGroup) + 1,
            Math.floor(promotionStudents.length / minPerGroup),
        );

        const students = promotionStudents.map(({ student }) => student);

        const projectGroupsCreated = await tx.projectGroup.createManyAndReturn({
            data: Array.from({ length: totalGroups }).map((_, i) => ({
                promotionProjectId,
                name: `Group ${i + 1}`,
            })),
        });

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

            if (
                createdPromotionProject.projectGroupRule ===
                ProjectGroupRule.RANDOM
            ) {
                await this.assignStudentToProjectGroupRandomly({
                    promotion,
                    promotionProject: createdPromotionProject,
                    tx,
                });
            }

            return createdPromotionProject;
        });
    }

    async update(
        promotionProjectId: string,
        updatePromotionProjectDto: UpdatePromotionProjectDto,
    ) {
        const foundPromotionProject =
            await this.prisma.promotionProject.findUnique({
                where: {
                    id: promotionProjectId,
                },
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
                    projectGroups: true,
                },
            });

        if (!foundPromotionProject) {
            throw new NotFoundException();
        }

        const { projectGroupRule, maxPerGroup, minPerGroup } =
            foundPromotionProject;

        const hasProjectGroups = foundPromotionProject.projectGroups.length;

        const isCurrentRandomGroupRule =
            projectGroupRule === ProjectGroupRule.RANDOM;

        const isCurrentOtherThanRandomRuleGroup =
            projectGroupRule !== ProjectGroupRule.RANDOM;

        if (
            hasProjectGroups &&
            isCurrentOtherThanRandomRuleGroup &&
            updatePromotionProjectDto.projectGroupRule ===
                ProjectGroupRule.RANDOM
        ) {
            throw new BadRequestException(
                "Project groups have already been created, you cannot switch to RANDOM group rule",
            );
        }

        if (
            isCurrentRandomGroupRule &&
            (maxPerGroup !== updatePromotionProjectDto?.maxPerGroup ||
                minPerGroup !== updatePromotionProjectDto?.minPerGroup)
        ) {
            throw new BadRequestException(
                "Min and max per group cannot be change if the group type is RANDOM",
            );
        }

        return this.prisma.$transaction(async (tx) => {
            if (
                updatePromotionProjectDto.projectGroupRule ===
                ProjectGroupRule.RANDOM
            ) {
                await this.assignStudentToProjectGroupRandomly({
                    promotion: foundPromotionProject.promotion,
                    promotionProject: foundPromotionProject,
                    tx,
                });
            }

            return tx.promotionProject.update({
                where: {
                    id: promotionProjectId,
                },
                data: updatePromotionProjectDto,
            });
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
                    orderBy: {
                        createdAt: "asc",
                    },
                },
                reportSections: {
                    include: {
                        reports: true,
                    },
                },
            },
        });
    }

    async delete(where: Prisma.PromotionProjectWhereUniqueInput) {
        return this.prisma.promotionProject.delete({
            where,
        });
    }
}
