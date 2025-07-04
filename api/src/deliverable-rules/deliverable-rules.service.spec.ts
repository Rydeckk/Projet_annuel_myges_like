import { Test, TestingModule } from "@nestjs/testing";
import { DeliverableRulesService } from "./deliverable-rules.service";
import { PrismaService } from "../prisma/prisma.service";
import { RuleType, MatchType } from "@prisma/client";
import { NotFoundException, BadRequestException } from "@nestjs/common";

const mockPrismaService = {
    deliverableRule: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    ruleMaxSizeFile: {
        create: jest.fn(),
        update: jest.fn(),
    },
    ruleFilePresence: {
        create: jest.fn(),
        update: jest.fn(),
    },
    ruleFileContentMatch: {
        create: jest.fn(),
        update: jest.fn(),
    },
    ruleFolderStructure: {
        create: jest.fn(),
        update: jest.fn(),
    },
    promotionProject: {
        findUnique: jest.fn(),
    },
    promotionProjectDeliverableRule: {
        findUnique: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
        findMany: jest.fn(),
    },
};

describe("DeliverableRulesService", () => {
    let service: DeliverableRulesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DeliverableRulesService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<DeliverableRulesService>(DeliverableRulesService);

        // Reset all mocks
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("create", () => {
        it("should create a MAX_SIZE_FILE rule", async () => {
            const createDto = {
                ruleType: RuleType.MAX_SIZE_FILE,
                ruleData: { maxSize: 1024 * 1024 },
            };

            const mockCreatedRule = {
                id: "rule-1",
                ruleType: RuleType.MAX_SIZE_FILE,
            };
            const mockRuleWithData = {
                ...mockCreatedRule,
                ruleMaxSizeFile: { maxSize: 1024 * 1024 },
                ruleFilePresence: null,
                ruleFileContentMatch: null,
                ruleFolderStructure: null,
            };

            mockPrismaService.deliverableRule.create.mockResolvedValue(
                mockCreatedRule,
            );
            mockPrismaService.ruleMaxSizeFile.create.mockResolvedValue({
                maxSize: 1024 * 1024,
            });
            mockPrismaService.deliverableRule.findUnique.mockResolvedValue(
                mockRuleWithData,
            );

            const result = await service.create(createDto);

            expect(
                mockPrismaService.deliverableRule.create,
            ).toHaveBeenCalledWith({
                data: { ruleType: RuleType.MAX_SIZE_FILE },
            });
            expect(
                mockPrismaService.ruleMaxSizeFile.create,
            ).toHaveBeenCalledWith({
                data: {
                    deliverableRuleId: "rule-1",
                    maxSize: 1024 * 1024,
                },
            });
            expect(result).toEqual(mockRuleWithData);
        });

        it("should create a FILE_PRESENCE rule", async () => {
            const createDto = {
                ruleType: RuleType.FILE_PRESENCE,
                ruleData: { fileName: "README.md" },
            };

            const mockCreatedRule = {
                id: "rule-2",
                ruleType: RuleType.FILE_PRESENCE,
            };
            mockPrismaService.deliverableRule.create.mockResolvedValue(
                mockCreatedRule,
            );
            mockPrismaService.ruleFilePresence.create.mockResolvedValue({
                fileName: "README.md",
            });
            mockPrismaService.deliverableRule.findUnique.mockResolvedValue(
                mockCreatedRule,
            );

            await service.create(createDto);

            expect(
                mockPrismaService.ruleFilePresence.create,
            ).toHaveBeenCalledWith({
                data: {
                    deliverableRuleId: "rule-2",
                    fileName: "README.md",
                },
            });
        });

        it("should create a FILE_CONTENT_MATCH rule", async () => {
            const createDto = {
                ruleType: RuleType.FILE_CONTENT_MATCH,
                ruleData: {
                    fileName: "package.json",
                    match: "test-project",
                    matchType: "TEXT" as MatchType,
                },
            } as const;

            const mockCreatedRule = {
                id: "rule-3",
                ruleType: RuleType.FILE_CONTENT_MATCH,
            };
            mockPrismaService.deliverableRule.create.mockResolvedValue(
                mockCreatedRule,
            );
            mockPrismaService.ruleFileContentMatch.create.mockResolvedValue(
                createDto.ruleData,
            );
            mockPrismaService.deliverableRule.findUnique.mockResolvedValue(
                mockCreatedRule,
            );

            await service.create(createDto);

            expect(
                mockPrismaService.ruleFileContentMatch.create,
            ).toHaveBeenCalledWith({
                data: {
                    deliverableRuleId: "rule-3",
                    fileName: "package.json",
                    match: "test-project",
                    matchType: "TEXT" as MatchType,
                },
            });
        });

        it("should create a FOLDER_STRUCTURE rule", async () => {
            const expectedStructure = {
                type: "folder" as const,
                name: "root",
                required: true,
                children: [
                    {
                        type: "folder" as const,
                        name: "src",
                        required: true,
                        children: [
                            {
                                type: "file" as const,
                                name: "index.js",
                                required: true,
                            },
                        ],
                    },
                ],
            };
            const createDto = {
                ruleType: RuleType.FOLDER_STRUCTURE,
                ruleData: { expectedStructure },
            } as const;

            const mockCreatedRule = {
                id: "rule-4",
                ruleType: RuleType.FOLDER_STRUCTURE,
            };
            mockPrismaService.deliverableRule.create.mockResolvedValue(
                mockCreatedRule,
            );
            mockPrismaService.ruleFolderStructure.create.mockResolvedValue({
                expectedStructure: JSON.stringify(expectedStructure),
            });
            mockPrismaService.deliverableRule.findUnique.mockResolvedValue(
                mockCreatedRule,
            );

            await service.create(createDto);

            expect(
                mockPrismaService.ruleFolderStructure.create,
            ).toHaveBeenCalledWith({
                data: {
                    deliverableRuleId: "rule-4",
                    expectedStructure: JSON.stringify(expectedStructure),
                },
            });
        });

        it("should throw error for unsupported rule type", async () => {
            const createDto = {
                ruleType: "UNSUPPORTED_RULE" as RuleType,
                ruleData: { maxSize: 1024 },
            } as const;

            const mockCreatedRule = {
                id: "rule-5",
                ruleType: "UNSUPPORTED_RULE",
            };
            mockPrismaService.deliverableRule.create.mockResolvedValue(
                mockCreatedRule,
            );

            await expect(service.create(createDto)).rejects.toThrow(
                BadRequestException,
            );
        });
    });

    describe("findOne", () => {
        it("should return a rule when found", async () => {
            const mockRule = {
                id: "rule-1",
                ruleType: RuleType.MAX_SIZE_FILE,
                ruleMaxSizeFile: { maxSize: 1024 * 1024 },
            };

            mockPrismaService.deliverableRule.findUnique.mockResolvedValue(
                mockRule,
            );

            const result = await service.findOne("rule-1");

            expect(result).toEqual(mockRule);
            expect(
                mockPrismaService.deliverableRule.findUnique,
            ).toHaveBeenCalledWith({
                where: { id: "rule-1" },
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
        });

        it("should throw NotFoundException when rule not found", async () => {
            mockPrismaService.deliverableRule.findUnique.mockResolvedValue(
                null,
            );

            await expect(service.findOne("non-existent")).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe("assignRuleToPromotionProject", () => {
        it("should assign rule to promotion project successfully", async () => {
            const assignDto = {
                deliverableRuleId: "rule-1",
                promotionProjectId: "project-1",
            };

            const mockRule = { id: "rule-1", ruleType: RuleType.MAX_SIZE_FILE };
            const mockProject = { id: "project-1", name: "Test Project" };

            mockPrismaService.deliverableRule.findUnique.mockResolvedValue(
                mockRule,
            );
            mockPrismaService.promotionProject.findUnique.mockResolvedValue(
                mockProject,
            );
            mockPrismaService.promotionProjectDeliverableRule.findUnique.mockResolvedValue(
                null,
            );
            mockPrismaService.promotionProjectDeliverableRule.create.mockResolvedValue(
                assignDto,
            );

            await service.assignRuleToPromotionProject(assignDto);

            expect(
                mockPrismaService.promotionProjectDeliverableRule.create,
            ).toHaveBeenCalledWith({
                data: assignDto,
            });
        });

        it("should throw NotFoundException when rule does not exist", async () => {
            const assignDto = {
                deliverableRuleId: "non-existent-rule",
                promotionProjectId: "project-1",
            };

            mockPrismaService.deliverableRule.findUnique.mockResolvedValue(
                null,
            );

            await expect(
                service.assignRuleToPromotionProject(assignDto),
            ).rejects.toThrow(NotFoundException);
        });

        it("should throw NotFoundException when promotion project does not exist", async () => {
            const assignDto = {
                deliverableRuleId: "rule-1",
                promotionProjectId: "non-existent-project",
            };

            const mockRule = { id: "rule-1", ruleType: RuleType.MAX_SIZE_FILE };
            mockPrismaService.deliverableRule.findUnique.mockResolvedValue(
                mockRule,
            );
            mockPrismaService.promotionProject.findUnique.mockResolvedValue(
                null,
            );

            await expect(
                service.assignRuleToPromotionProject(assignDto),
            ).rejects.toThrow(NotFoundException);
        });

        it("should throw BadRequestException when rule is already assigned", async () => {
            const assignDto = {
                deliverableRuleId: "rule-1",
                promotionProjectId: "project-1",
            };

            const mockRule = { id: "rule-1", ruleType: RuleType.MAX_SIZE_FILE };
            const mockProject = { id: "project-1", name: "Test Project" };
            const existingAssignment = { id: "assignment-1", ...assignDto };

            mockPrismaService.deliverableRule.findUnique.mockResolvedValue(
                mockRule,
            );
            mockPrismaService.promotionProject.findUnique.mockResolvedValue(
                mockProject,
            );
            mockPrismaService.promotionProjectDeliverableRule.findUnique.mockResolvedValue(
                existingAssignment,
            );

            await expect(
                service.assignRuleToPromotionProject(assignDto),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe("removeRuleFromPromotionProject", () => {
        it("should remove rule assignment successfully", async () => {
            const deliverableRuleId = "rule-1";
            const promotionProjectId = "project-1";
            const mockAssignment = {
                id: "assignment-1",
                deliverableRuleId,
                promotionProjectId,
            };

            mockPrismaService.promotionProjectDeliverableRule.findUnique.mockResolvedValue(
                mockAssignment,
            );
            mockPrismaService.promotionProjectDeliverableRule.delete.mockResolvedValue(
                mockAssignment,
            );

            await service.removeRuleFromPromotionProject(
                deliverableRuleId,
                promotionProjectId,
            );

            expect(
                mockPrismaService.promotionProjectDeliverableRule.delete,
            ).toHaveBeenCalledWith({
                where: {
                    deliverableRuleId_promotionProjectId: {
                        deliverableRuleId,
                        promotionProjectId,
                    },
                },
            });
        });

        it("should throw NotFoundException when assignment does not exist", async () => {
            mockPrismaService.promotionProjectDeliverableRule.findUnique.mockResolvedValue(
                null,
            );

            await expect(
                service.removeRuleFromPromotionProject("rule-1", "project-1"),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe("getPromotionProjectRules", () => {
        it("should return rules for promotion project", async () => {
            const promotionProjectId = "project-1";
            const mockRules = [
                {
                    id: "assignment-1",
                    deliverableRule: {
                        id: "rule-1",
                        ruleType: RuleType.MAX_SIZE_FILE,
                        ruleMaxSizeFile: { maxSize: 1024 * 1024 },
                    },
                },
            ];

            mockPrismaService.promotionProjectDeliverableRule.findMany.mockResolvedValue(
                mockRules,
            );

            const result =
                await service.getPromotionProjectRules(promotionProjectId);

            expect(result).toEqual(mockRules);
            expect(
                mockPrismaService.promotionProjectDeliverableRule.findMany,
            ).toHaveBeenCalledWith({
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
        });
    });
});
