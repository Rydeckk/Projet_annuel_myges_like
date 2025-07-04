import { Test, TestingModule } from "@nestjs/testing";
import { DeliverableValidationService } from "./deliverable-validation.service";
import { PrismaService } from "../prisma/prisma.service";
import { RuleType, MatchType } from "@prisma/client";
import * as JSZip from "jszip";

const mockPrismaService = {
    deliverable: {
        findUnique: jest.fn(),
    },
};

describe("DeliverableValidationService", () => {
    let service: DeliverableValidationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DeliverableValidationService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<DeliverableValidationService>(
            DeliverableValidationService,
        );
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("validateDeliverable", () => {
        const mockDeliverable = {
            id: "deliverable-1",
            projectGroup: {
                promotionProject: {
                    promotionProjectDeliverableRules: [
                        {
                            deliverableRule: {
                                id: "rule-1",
                                ruleType: RuleType.MAX_SIZE_FILE,
                                ruleMaxSizeFile: {
                                    maxSize: 1024 * 1024, // 1MB
                                },
                                ruleFilePresence: null,
                                ruleFileContentMatch: null,
                                ruleFolderStructure: null,
                            },
                        },
                    ],
                },
            },
            deliverableArchive: {
                fileSize: 512 * 1024, // 512KB
            },
        };

        beforeEach(() => {
            mockPrismaService.deliverable.findUnique.mockResolvedValue(
                mockDeliverable,
            );
        });

        it("should validate max file size rule successfully", async () => {
            const result = await service.validateDeliverable("deliverable-1");

            expect(result.isValid).toBe(true);
            expect(result.results).toHaveLength(1);
            expect(result.results[0].ruleType).toBe(RuleType.MAX_SIZE_FILE);
            expect(result.results[0].isValid).toBe(true);
            expect(result.summary.totalRules).toBe(1);
            expect(result.summary.passedRules).toBe(1);
            expect(result.summary.failedRules).toBe(0);
        });

        it("should fail max file size validation when file is too large", async () => {
            const largeMockDeliverable = {
                ...mockDeliverable,
                deliverableArchive: {
                    fileSize: 2 * 1024 * 1024, // 2MB
                },
            };
            mockPrismaService.deliverable.findUnique.mockResolvedValue(
                largeMockDeliverable,
            );

            const result = await service.validateDeliverable("deliverable-1");

            expect(result.isValid).toBe(false);
            expect(result.results[0].isValid).toBe(false);
            expect(result.results[0].message).toContain("exceeds maximum");
            expect(result.summary.failedRules).toBe(1);
        });

        it("should validate file presence rule with zip buffer", async () => {
            const zip = new JSZip();
            zip.file("README.md", "This is a test readme");
            zip.file("src/index.js", 'console.log("Hello");');
            const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

            const mockDeliverableWithFile = {
                ...mockDeliverable,
                projectGroup: {
                    promotionProject: {
                        promotionProjectDeliverableRules: [
                            {
                                deliverableRule: {
                                    id: "rule-2",
                                    ruleType: RuleType.FILE_PRESENCE,
                                    ruleMaxSizeFile: null,
                                    ruleFilePresence: {
                                        fileName: "README.md",
                                    },
                                    ruleFileContentMatch: null,
                                    ruleFolderStructure: null,
                                },
                            },
                        ],
                    },
                },
            };
            mockPrismaService.deliverable.findUnique.mockResolvedValue(
                mockDeliverableWithFile,
            );

            const result = await service.validateDeliverable(
                "deliverable-1",
                undefined,
                zipBuffer,
            );

            expect(result.isValid).toBe(true);
            expect(result.results[0].ruleType).toBe(RuleType.FILE_PRESENCE);
            expect(result.results[0].isValid).toBe(true);
            expect(result.results[0].message).toContain("README.md");
        });

        it("should validate file content match rule with regex", async () => {
            const zip = new JSZip();
            zip.file(
                "package.json",
                JSON.stringify({ name: "test-project", version: "1.0.0" }),
            );
            const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

            const mockDeliverableWithContent = {
                ...mockDeliverable,
                projectGroup: {
                    promotionProject: {
                        promotionProjectDeliverableRules: [
                            {
                                deliverableRule: {
                                    id: "rule-3",
                                    ruleType: RuleType.FILE_CONTENT_MATCH,
                                    ruleMaxSizeFile: null,
                                    ruleFilePresence: null,
                                    ruleFileContentMatch: {
                                        fileName: "package.json",
                                        match: '"name"\\s*:\\s*"test-project"',
                                        matchType: MatchType.REGEX,
                                    },
                                    ruleFolderStructure: null,
                                },
                            },
                        ],
                    },
                },
            };
            mockPrismaService.deliverable.findUnique.mockResolvedValue(
                mockDeliverableWithContent,
            );

            const result = await service.validateDeliverable(
                "deliverable-1",
                undefined,
                zipBuffer,
            );

            expect(result.isValid).toBe(true);
            expect(result.results[0].ruleType).toBe(
                RuleType.FILE_CONTENT_MATCH,
            );
            expect(result.results[0].isValid).toBe(true);
        });

        it("should validate folder structure rule", async () => {
            const zip = new JSZip();
            zip.file("src/index.js", 'console.log("Hello");');
            zip.file("src/utils/helper.js", "module.exports = {};");
            zip.file("package.json", "{}");
            zip.file("README.md", "# Test Project");
            const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

            const expectedStructure = {
                src: {
                    "index.js": "file",
                    utils: {
                        "helper.js": "file",
                    },
                },
                "package.json": "file",
                "README.md": "file",
            };

            const mockDeliverableWithStructure = {
                ...mockDeliverable,
                projectGroup: {
                    promotionProject: {
                        promotionProjectDeliverableRules: [
                            {
                                deliverableRule: {
                                    id: "rule-4",
                                    ruleType: RuleType.FOLDER_STRUCTURE,
                                    ruleMaxSizeFile: null,
                                    ruleFilePresence: null,
                                    ruleFileContentMatch: null,
                                    ruleFolderStructure: {
                                        expectedStructure:
                                            JSON.stringify(expectedStructure),
                                    },
                                },
                            },
                        ],
                    },
                },
            };
            mockPrismaService.deliverable.findUnique.mockResolvedValue(
                mockDeliverableWithStructure,
            );

            const result = await service.validateDeliverable(
                "deliverable-1",
                undefined,
                zipBuffer,
            );

            expect(result.isValid).toBe(true);
            expect(result.results[0].ruleType).toBe(RuleType.FOLDER_STRUCTURE);
            expect(result.results[0].isValid).toBe(true);
        });

        it("should handle multiple validation rules", async () => {
            const zip = new JSZip();
            zip.file("README.md", "This is a test readme");
            zip.file("package.json", JSON.stringify({ name: "test-project" }));
            const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

            const mockDeliverableMultipleRules = {
                ...mockDeliverable,
                projectGroup: {
                    promotionProject: {
                        promotionProjectDeliverableRules: [
                            {
                                deliverableRule: {
                                    id: "rule-1",
                                    ruleType: RuleType.MAX_SIZE_FILE,
                                    ruleMaxSizeFile: { maxSize: 1024 * 1024 },
                                    ruleFilePresence: null,
                                    ruleFileContentMatch: null,
                                    ruleFolderStructure: null,
                                },
                            },
                            {
                                deliverableRule: {
                                    id: "rule-2",
                                    ruleType: RuleType.FILE_PRESENCE,
                                    ruleMaxSizeFile: null,
                                    ruleFilePresence: { fileName: "README.md" },
                                    ruleFileContentMatch: null,
                                    ruleFolderStructure: null,
                                },
                            },
                        ],
                    },
                },
            };
            mockPrismaService.deliverable.findUnique.mockResolvedValue(
                mockDeliverableMultipleRules,
            );

            const result = await service.validateDeliverable(
                "deliverable-1",
                undefined,
                zipBuffer,
            );

            expect(result.isValid).toBe(true);
            expect(result.results).toHaveLength(2);
            expect(result.summary.totalRules).toBe(2);
            expect(result.summary.passedRules).toBe(2);
            expect(result.summary.failedRules).toBe(0);
        });

        it("should throw error for non-existent deliverable", async () => {
            mockPrismaService.deliverable.findUnique.mockResolvedValue(null);

            await expect(
                service.validateDeliverable("non-existent"),
            ).rejects.toThrow("Deliverable not found");
        });
    });

    describe("formatBytes", () => {
        it("should format bytes correctly", () => {
            // Access private method through reflection for testing
            const serviceWithPrivate = service as unknown as {
                formatBytes: (bytes: number) => string;
            };

            expect(serviceWithPrivate.formatBytes(0)).toBe("0 Bytes");
            expect(serviceWithPrivate.formatBytes(1024)).toBe("1 KB");
            expect(serviceWithPrivate.formatBytes(1024 * 1024)).toBe("1 MB");
            expect(serviceWithPrivate.formatBytes(1536)).toBe("1.5 KB");
        });
    });
});
