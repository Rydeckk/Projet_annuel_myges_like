import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import {
    CreateDeliverableRuleDto,
    UpdateDeliverableRuleDto,
    RuleMaxSizeDto,
    RuleFilePresenceDto,
    RuleFileContentMatchDto,
    RuleFolderStructureDto,
    AssignRuleToPromotionProjectDto,
} from "./dto/deliverable-rule.dto";
import { RuleType } from "@prisma/client";

type RuleDataType =
    | RuleMaxSizeDto
    | RuleFilePresenceDto
    | RuleFileContentMatchDto
    | RuleFolderStructureDto;

@Injectable()
export class DeliverableRulesService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createDeliverableRuleDto: CreateDeliverableRuleDto) {
        const { ruleType, ruleData, ...baseData } = createDeliverableRuleDto;

        // Create the base rule first
        const deliverableRule = await this.prisma.deliverableRule.create({
            data: {
                ruleType,
                ...baseData,
            },
        });

        // Create the specific rule data based on type
        await this.createSpecificRule(deliverableRule.id, ruleType, ruleData);

        return this.findOne(deliverableRule.id);
    }

    async findAll() {
        return this.prisma.deliverableRule.findMany({
            include: {
                ruleMaxSizeFile: true,
                ruleFilePresence: true,
                ruleFileContentMatch: true,
                ruleFolderStructure: true,
                promotionProjectDeliverableRules: {
                    include: {
                        promotionProject: {
                            include: {
                                project: true,
                                promotion: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async findByPromotionProject(promotionProjectId: string) {
        return this.prisma.deliverableRule.findMany({
            where: {
                promotionProjectDeliverableRules: {
                    some: {
                        promotionProjectId,
                    },
                },
            },
            include: {
                ruleMaxSizeFile: true,
                ruleFilePresence: true,
                ruleFileContentMatch: true,
                ruleFolderStructure: true,
            },
        });
    }

    async findOne(id: string) {
        const rule = await this.prisma.deliverableRule.findUnique({
            where: { id },
            include: {
                ruleMaxSizeFile: true,
                ruleFilePresence: true,
                ruleFileContentMatch: true,
                ruleFolderStructure: true,
                promotionProjectDeliverableRules: {
                    include: {
                        promotionProject: {
                            include: {
                                project: true,
                                promotion: true,
                            },
                        },
                    },
                },
            },
        });

        if (!rule) {
            throw new NotFoundException("Deliverable rule not found");
        }

        return rule;
    }

    async update(
        id: string,
        updateDeliverableRuleDto: UpdateDeliverableRuleDto,
    ) {
        const existingRule = await this.findOne(id);
        const { ruleData, ...baseData } = updateDeliverableRuleDto;

        // Update base rule
        await this.prisma.deliverableRule.update({
            where: { id },
            data: baseData,
        });

        // Update specific rule data if provided
        if (ruleData) {
            await this.updateSpecificRule(id, existingRule.ruleType, ruleData);
        }

        return this.findOne(id);
    }

    async remove(id: string) {
        await this.findOne(id);

        // The cascade delete will handle the specific rule data
        return this.prisma.deliverableRule.delete({
            where: { id },
        });
    }

    private async createSpecificRule(
        deliverableRuleId: string,
        ruleType: RuleType,
        ruleData: RuleDataType,
    ) {
        switch (ruleType) {
            case RuleType.MAX_SIZE_FILE: {
                const maxSizeData = ruleData as RuleMaxSizeDto;
                return this.prisma.ruleMaxSizeFile.create({
                    data: {
                        deliverableRuleId,
                        maxSize: maxSizeData.maxSize,
                    },
                });
            }

            case RuleType.FILE_PRESENCE: {
                const filePresenceData = ruleData as RuleFilePresenceDto;
                return this.prisma.ruleFilePresence.create({
                    data: {
                        deliverableRuleId,
                        fileName: filePresenceData.fileName,
                    },
                });
            }

            case RuleType.FILE_CONTENT_MATCH: {
                const contentMatchData = ruleData as RuleFileContentMatchDto;
                return this.prisma.ruleFileContentMatch.create({
                    data: {
                        deliverableRuleId,
                        fileName: contentMatchData.fileName,
                        match: contentMatchData.match,
                        matchType: contentMatchData.matchType,
                    },
                });
            }

            case RuleType.FOLDER_STRUCTURE: {
                const folderStructureData = ruleData as RuleFolderStructureDto;
                return this.prisma.ruleFolderStructure.create({
                    data: {
                        deliverableRuleId,
                        expectedStructure: JSON.stringify(
                            folderStructureData.expectedStructure,
                        ),
                    },
                });
            }

            default:
                throw new BadRequestException(
                    `Unsupported rule type: ${ruleType as string}`,
                );
        }
    }

    private async updateSpecificRule(
        deliverableRuleId: string,
        ruleType: RuleType,
        ruleData: RuleDataType,
    ) {
        switch (ruleType) {
            case RuleType.MAX_SIZE_FILE: {
                const maxSizeData = ruleData as RuleMaxSizeDto;
                return this.prisma.ruleMaxSizeFile.update({
                    where: { deliverableRuleId },
                    data: { maxSize: maxSizeData.maxSize },
                });
            }

            case RuleType.FILE_PRESENCE: {
                const filePresenceData = ruleData as RuleFilePresenceDto;
                return this.prisma.ruleFilePresence.update({
                    where: { deliverableRuleId },
                    data: { fileName: filePresenceData.fileName },
                });
            }

            case RuleType.FILE_CONTENT_MATCH: {
                const contentMatchData = ruleData as RuleFileContentMatchDto;
                return this.prisma.ruleFileContentMatch.update({
                    where: { deliverableRuleId },
                    data: {
                        fileName: contentMatchData.fileName,
                        match: contentMatchData.match,
                        matchType: contentMatchData.matchType,
                    },
                });
            }

            case RuleType.FOLDER_STRUCTURE: {
                const folderStructureData = ruleData as RuleFolderStructureDto;
                return this.prisma.ruleFolderStructure.update({
                    where: { deliverableRuleId },
                    data: {
                        expectedStructure: JSON.stringify(
                            folderStructureData.expectedStructure,
                        ),
                    },
                });
            }

            default:
                throw new BadRequestException(
                    `Unsupported rule type: ${ruleType as string}`,
                );
        }
    }

    async assignRuleToPromotionProject(
        assignDto: AssignRuleToPromotionProjectDto,
    ): Promise<void> {
        // Verify rule exists
        await this.findOne(assignDto.deliverableRuleId);

        // Verify promotion project exists
        const promotionProject = await this.prisma.promotionProject.findUnique({
            where: { id: assignDto.promotionProjectId },
        });

        if (!promotionProject) {
            throw new NotFoundException("Promotion project not found");
        }

        // Check if already assigned
        const existing =
            await this.prisma.promotionProjectDeliverableRule.findUnique({
                where: {
                    deliverableRuleId_promotionProjectId: {
                        deliverableRuleId: assignDto.deliverableRuleId,
                        promotionProjectId: assignDto.promotionProjectId,
                    },
                },
            });

        if (existing) {
            throw new BadRequestException(
                "Rule is already assigned to this promotion project",
            );
        }

        await this.prisma.promotionProjectDeliverableRule.create({
            data: assignDto,
        });
    }

    async removeRuleFromPromotionProject(
        deliverableRuleId: string,
        promotionProjectId: string,
    ): Promise<void> {
        const assignment =
            await this.prisma.promotionProjectDeliverableRule.findUnique({
                where: {
                    deliverableRuleId_promotionProjectId: {
                        deliverableRuleId,
                        promotionProjectId,
                    },
                },
            });

        if (!assignment) {
            throw new NotFoundException(
                "Rule assignment not found for this promotion project",
            );
        }

        await this.prisma.promotionProjectDeliverableRule.delete({
            where: {
                deliverableRuleId_promotionProjectId: {
                    deliverableRuleId,
                    promotionProjectId,
                },
            },
        });
    }

    async getPromotionProjectRules(promotionProjectId: string) {
        return this.prisma.promotionProjectDeliverableRule.findMany({
            where: { promotionProjectId },
            include: {
                deliverableRule: {
                    include: {
                        ruleMaxSizeFile: true,
                        ruleFilePresence: true,
                        ruleFileContentMatch: true,
                        ruleFolderStructure: true,
                    },
                },
                promotionProject: {
                    include: {
                        project: true,
                        promotion: true,
                    },
                },
            },
        });
    }
}
