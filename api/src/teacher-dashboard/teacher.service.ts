import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

export interface ProjectOverview {
    project: {
        id: string;
        name: string;
        description: string;
    };
    totalGroups: number;
    submittedGroups: number;
    pendingGroups: number;
    complianceRate: number;
    averageSimilarity: number;
}

export interface SubmissionStatus {
    groupId: string;
    groupName: string;
    students: Array<{
        id: string;
        name: string;
        email: string;
    }>;
    deliverables: Array<{
        id: string;
        name: string;
        submitted: boolean;
        submittedAt: Date | null;
        isLate: boolean;
    }>;
}

export interface ComplianceStatus {
    groupId: string;
    groupName: string;
    totalRules: number;
    passedRules: number;
    failedRules: number;
    complianceRate: number;
    ruleDetails: Array<{
        ruleId: string;
        ruleType: string;
        passed: boolean;
    }>;
}

export interface SimilarityResult {
    group1Id: string;
    group1Name: string;
    group2Id: string;
    group2Name: string;
    similarityRate: number;
    deliverable1Id: string;
    deliverable2Id: string;
}

@Injectable()
export class TeacherService {
    constructor(private readonly prisma: PrismaService) {}

    async getProjectOverview(
        promotionProjectId: string,
    ): Promise<ProjectOverview> {
        const promotionProject = await this.prisma.promotionProject.findUnique({
            where: { id: promotionProjectId },
            include: {
                project: true,
                projectGroups: {
                    include: {
                        deliverables: {
                            select: {
                                id: true,
                                submitAt: true,
                                deadline: true,
                            },
                        },
                        projectGroupResult: {
                            include: {
                                deliverableRuleResults: true,
                            },
                        },
                    },
                },
            },
        });

        if (!promotionProject) {
            throw new NotFoundException("Promotion project not found");
        }

        const totalGroups = promotionProject.projectGroups.length;
        const submittedGroups = promotionProject.projectGroups.filter((group) =>
            group.deliverables.some((d) => d.submitAt),
        ).length;
        const pendingGroups = totalGroups - submittedGroups;

        // Calculate compliance rate
        const groupsWithResults = promotionProject.projectGroups.filter(
            (group) => group.projectGroupResult,
        );
        let totalRules = 0;
        let passedRules = 0;

        groupsWithResults.forEach((group) => {
            if (group.projectGroupResult) {
                group.projectGroupResult.deliverableRuleResults.forEach(
                    (result) => {
                        totalRules++;
                        if (result.isRuleRespected) {
                            passedRules++;
                        }
                    },
                );
            }
        });

        const complianceRate =
            totalRules > 0 ? (passedRules / totalRules) * 100 : 0;

        // Calculate average similarity (placeholder for now)
        const averageSimilarity = 0; // Will be implemented with similarity analysis

        return {
            project: {
                id: promotionProject.project.id,
                name: promotionProject.project.name,
                description: promotionProject.project.description || "",
            },
            totalGroups,
            submittedGroups,
            pendingGroups,
            complianceRate,
            averageSimilarity,
        };
    }

    async getProjectSubmissions(
        promotionProjectId: string,
    ): Promise<SubmissionStatus[]> {
        const promotionProject = await this.prisma.promotionProject.findUnique({
            where: { id: promotionProjectId },
            include: {
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
                        deliverables: {
                            select: {
                                id: true,
                                name: true,
                                submitAt: true,
                                deadline: true,
                            },
                        },
                    },
                },
            },
        });

        if (!promotionProject) {
            throw new NotFoundException("Promotion project not found");
        }

        return promotionProject.projectGroups.map((group) => ({
            groupId: group.id,
            groupName: group.name,
            students: group.projectGroupStudents.map((pgs) => ({
                id: pgs.student.id,
                name: `${pgs.student.user.firstName} ${pgs.student.user.lastName}`,
                email: pgs.student.user.email,
            })),
            deliverables: group.deliverables.map((deliverable) => {
                const isLate =
                    deliverable.deadline && deliverable.submitAt
                        ? new Date(deliverable.submitAt) >
                          new Date(deliverable.deadline)
                        : false;

                return {
                    id: deliverable.id,
                    name: deliverable.name,
                    submitted: !!deliverable.submitAt,
                    submittedAt: deliverable.submitAt,
                    isLate,
                };
            }),
        }));
    }

    async getProjectCompliance(
        promotionProjectId: string,
    ): Promise<ComplianceStatus[]> {
        const promotionProject = await this.prisma.promotionProject.findUnique({
            where: { id: promotionProjectId },
            include: {
                projectGroups: {
                    include: {
                        projectGroupResult: {
                            include: {
                                deliverableRuleResults: {
                                    include: {
                                        deliverableRule: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!promotionProject) {
            throw new NotFoundException("Promotion project not found");
        }

        return promotionProject.projectGroups.map((group) => {
            const ruleResults =
                group.projectGroupResult?.deliverableRuleResults || [];
            const totalRules = ruleResults.length;
            const passedRules = ruleResults.filter(
                (r) => r.isRuleRespected,
            ).length;
            const failedRules = totalRules - passedRules;
            const complianceRate =
                totalRules > 0 ? (passedRules / totalRules) * 100 : 0;

            return {
                groupId: group.id,
                groupName: group.name,
                totalRules,
                passedRules,
                failedRules,
                complianceRate,
                ruleDetails: ruleResults.map((result) => ({
                    ruleId: result.deliverableRule.id,
                    ruleType: result.deliverableRule.ruleType,
                    passed: result.isRuleRespected,
                })),
            };
        });
    }

    async getProjectSimilarity(
        promotionProjectId: string,
    ): Promise<SimilarityResult[]> {
        const promotionProject = await this.prisma.promotionProject.findUnique({
            where: { id: promotionProjectId },
            include: {
                projectGroups: {
                    include: {
                        deliverables: {
                            include: {
                                similarityAnalysisAsDeliverable1: {
                                    include: {
                                        deliverable2: {
                                            include: {
                                                projectGroup: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!promotionProject) {
            throw new NotFoundException("Promotion project not found");
        }

        const results: SimilarityResult[] = [];

        promotionProject.projectGroups.forEach((group) => {
            group.deliverables.forEach((deliverable) => {
                deliverable.similarityAnalysisAsDeliverable1.forEach(
                    (analysis) => {
                        results.push({
                            group1Id: group.id,
                            group1Name: group.name,
                            group2Id: analysis.deliverable2.projectGroup.id,
                            group2Name: analysis.deliverable2.projectGroup.name,
                            similarityRate: analysis.similarityScore * 100, // Convert back to percentage for display
                            deliverable1Id: deliverable.id,
                            deliverable2Id: analysis.deliverable2.id,
                        });
                    },
                );
            });
        });

        // Sort by similarity rate (highest first)
        return results.sort((a, b) => b.similarityRate - a.similarityRate);
    }
}
