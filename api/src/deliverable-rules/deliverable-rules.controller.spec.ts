import { Test, TestingModule } from "@nestjs/testing";
import { DeliverableRulesController } from "./deliverable-rules.controller";
import { DeliverableRulesService } from "./deliverable-rules.service";
import { DeliverableValidationService } from "./deliverable-validation.service";
import { JwtAuthGuard } from "src/auth/strategies/jwt/jwt-auth.guard";
import { RuleType, MatchType } from "@prisma/client";

const mockDeliverableRulesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPromotionProject: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    assignRuleToPromotionProject: jest.fn(),
    removeRuleFromPromotionProject: jest.fn(),
    getPromotionProjectRules: jest.fn(),
};

const mockDeliverableValidationService = {
    validateDeliverable: jest.fn(),
};

const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
};

describe("DeliverableRulesController", () => {
    let controller: DeliverableRulesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DeliverableRulesController],
            providers: [
                {
                    provide: DeliverableRulesService,
                    useValue: mockDeliverableRulesService,
                },
                {
                    provide: DeliverableValidationService,
                    useValue: mockDeliverableValidationService,
                },
            ],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue(mockJwtAuthGuard)
            .compile();

        controller = module.get<DeliverableRulesController>(
            DeliverableRulesController,
        );

        // Reset all mocks
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("create", () => {
        it("should create a deliverable rule", async () => {
            const createDto = {
                ruleType: RuleType.MAX_SIZE_FILE,
                ruleData: { maxSize: 1024 * 1024 },
            };

            const mockResult = {
                id: "rule-1",
                ruleType: RuleType.MAX_SIZE_FILE,
                ruleMaxSizeFile: { maxSize: 1024 * 1024 },
            };

            mockDeliverableRulesService.create.mockResolvedValue(mockResult);

            const result = await controller.create(createDto);

            expect(mockDeliverableRulesService.create).toHaveBeenCalledWith(
                createDto,
            );
            expect(result).toEqual(mockResult);
        });
    });

    describe("findAll", () => {
        it("should return all deliverable rules", async () => {
            const mockRules = [
                {
                    id: "rule-1",
                    ruleType: RuleType.MAX_SIZE_FILE,
                    ruleMaxSizeFile: { maxSize: 1024 * 1024 },
                },
                {
                    id: "rule-2",
                    ruleType: RuleType.FILE_PRESENCE,
                    ruleFilePresence: { fileName: "README.md" },
                },
            ];

            mockDeliverableRulesService.findAll.mockResolvedValue(mockRules);

            const result = await controller.findAll();

            expect(mockDeliverableRulesService.findAll).toHaveBeenCalled();
            expect(result).toEqual(mockRules);
        });
    });

    describe("findByPromotionProject", () => {
        it("should return rules for a specific promotion project", async () => {
            const promotionProjectId = "project-1";
            const mockRules = [
                {
                    id: "rule-1",
                    ruleType: RuleType.MAX_SIZE_FILE,
                    ruleMaxSizeFile: { maxSize: 1024 * 1024 },
                },
            ];

            mockDeliverableRulesService.findByPromotionProject.mockResolvedValue(
                mockRules,
            );

            const result =
                await controller.findByPromotionProject(promotionProjectId);

            expect(
                mockDeliverableRulesService.findByPromotionProject,
            ).toHaveBeenCalledWith(promotionProjectId);
            expect(result).toEqual(mockRules);
        });
    });

    describe("findOne", () => {
        it("should return a specific deliverable rule", async () => {
            const ruleId = "rule-1";
            const mockRule = {
                id: "rule-1",
                ruleType: RuleType.FILE_CONTENT_MATCH,
                ruleFileContentMatch: {
                    fileName: "package.json",
                    match: "test-project",
                    matchType: "TEXT" as MatchType,
                },
            } as const;

            mockDeliverableRulesService.findOne.mockResolvedValue(mockRule);

            const result = await controller.findOne(ruleId);

            expect(mockDeliverableRulesService.findOne).toHaveBeenCalledWith(
                ruleId,
            );
            expect(result).toEqual(mockRule);
        });
    });

    describe("update", () => {
        it("should update a deliverable rule", async () => {
            const ruleId = "rule-1";
            const updateDto = {
                ruleData: { maxSize: 2048 * 1024 },
            };

            const mockUpdatedRule = {
                id: "rule-1",
                ruleType: RuleType.MAX_SIZE_FILE,
                ruleMaxSizeFile: { maxSize: 2048 * 1024 },
            };

            mockDeliverableRulesService.update.mockResolvedValue(
                mockUpdatedRule,
            );

            const result = await controller.update(ruleId, updateDto);

            expect(mockDeliverableRulesService.update).toHaveBeenCalledWith(
                ruleId,
                updateDto,
            );
            expect(result).toEqual(mockUpdatedRule);
        });
    });

    describe("remove", () => {
        it("should remove a deliverable rule", async () => {
            const ruleId = "rule-1";
            const mockDeletedRule = {
                id: "rule-1",
                ruleType: RuleType.MAX_SIZE_FILE,
            };

            mockDeliverableRulesService.remove.mockResolvedValue(
                mockDeletedRule,
            );

            const result = await controller.remove(ruleId);

            expect(mockDeliverableRulesService.remove).toHaveBeenCalledWith(
                ruleId,
            );
            expect(result).toEqual(mockDeletedRule);
        });
    });

    describe("assignRuleToPromotionProject", () => {
        it("should assign a rule to a promotion project", async () => {
            const assignDto = {
                deliverableRuleId: "rule-1",
                promotionProjectId: "project-1",
            };

            mockDeliverableRulesService.assignRuleToPromotionProject.mockResolvedValue(
                undefined,
            );

            await controller.assignRuleToPromotionProject(assignDto);

            expect(
                mockDeliverableRulesService.assignRuleToPromotionProject,
            ).toHaveBeenCalledWith(assignDto);
        });
    });

    describe("removeRuleFromPromotionProject", () => {
        it("should remove a rule from a promotion project", async () => {
            const deliverableRuleId = "rule-1";
            const promotionProjectId = "project-1";

            mockDeliverableRulesService.removeRuleFromPromotionProject.mockResolvedValue(
                undefined,
            );

            await controller.removeRuleFromPromotionProject(
                deliverableRuleId,
                promotionProjectId,
            );

            expect(
                mockDeliverableRulesService.removeRuleFromPromotionProject,
            ).toHaveBeenCalledWith(deliverableRuleId, promotionProjectId);
        });
    });

    describe("getPromotionProjectRules", () => {
        it("should get all rules for a promotion project", async () => {
            const promotionProjectId = "project-1";
            const mockRules = [
                {
                    id: "assignment-1",
                    deliverableRule: {
                        id: "rule-1",
                        ruleType: RuleType.MAX_SIZE_FILE,
                        ruleMaxSizeFile: { maxSize: 1024 * 1024 },
                    },
                    promotionProject: {
                        id: "project-1",
                        project: { name: "Test Project" },
                        promotion: { name: "Test Promotion" },
                    },
                },
            ];

            mockDeliverableRulesService.getPromotionProjectRules.mockResolvedValue(
                mockRules,
            );

            const result =
                await controller.getPromotionProjectRules(promotionProjectId);

            expect(
                mockDeliverableRulesService.getPromotionProjectRules,
            ).toHaveBeenCalledWith(promotionProjectId);
            expect(result).toEqual(mockRules);
        });
    });

    describe("validateDeliverable", () => {
        it("should validate a deliverable", async () => {
            const deliverableId = "deliverable-1";
            const mockValidationResult = {
                isValid: true,
                results: [
                    {
                        isValid: true,
                        ruleId: "rule-1",
                        ruleType: "MAX_SIZE_FILE",
                        message: "File size is within limit",
                    },
                ],
                summary: {
                    totalRules: 1,
                    passedRules: 1,
                    failedRules: 0,
                },
            };

            mockDeliverableValidationService.validateDeliverable.mockResolvedValue(
                mockValidationResult,
            );

            const result = await controller.validateDeliverable(deliverableId);

            expect(
                mockDeliverableValidationService.validateDeliverable,
            ).toHaveBeenCalledWith(deliverableId);
            expect(result).toEqual(mockValidationResult);
        });
    });
});
