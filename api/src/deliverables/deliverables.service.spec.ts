import { Test, TestingModule } from "@nestjs/testing";
import { DeliverablesService } from "./deliverables.service";
import { PrismaService } from "../prisma/prisma.service";
import { DeliverableValidationService } from "../deliverable-rules/deliverable-validation.service";
import { GoogleCloudStorageService } from "../google-cloud-storage/google-cloud-storage.service";
import { ForbiddenException } from "@nestjs/common";

// Mock fetch globally
global.fetch = jest.fn();

const mockPrismaService = {
    deliverable: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    deliverableArchive: {
        delete: jest.fn(),
        create: jest.fn(),
    },
    projectGroup: {
        findFirst: jest.fn(),
    },
    promotionProject: {
        findFirst: jest.fn(),
    },
    projectGroupResult: {
        findFirst: jest.fn(),
        create: jest.fn(),
    },
    deliverableRuleResult: {
        upsert: jest.fn(),
    },
};

const mockValidationService = {
    validateDeliverable: jest.fn(),
};

const mockGCSService = {
    uploadFile: jest.fn(),
};

describe("DeliverablesService", () => {
    let service: DeliverablesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DeliverablesService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
                {
                    provide: DeliverableValidationService,
                    useValue: mockValidationService,
                },
                {
                    provide: GoogleCloudStorageService,
                    useValue: mockGCSService,
                },
            ],
        }).compile();

        service = module.get<DeliverablesService>(DeliverablesService);

        // Reset all mocks
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("create", () => {
        it("should create a deliverable when student is in project group", async () => {
            const studentId = "student-1";
            const createDto = {
                name: "Test Deliverable",
                description: "Test Description",
                projectGroupId: "group-1",
            };

            const mockProjectGroup = {
                id: "group-1",
                projectGroupStudents: [{ studentId: "student-1" }],
            };

            const mockCreatedDeliverable = {
                id: "deliverable-1",
                ...createDto,
                uploadedByStudentId: studentId,
                deliverableArchive: null,
                uploadedByStudent: {
                    user: { firstName: "John", lastName: "Doe" },
                },
            };

            mockPrismaService.projectGroup.findFirst.mockResolvedValue(
                mockProjectGroup,
            );
            mockPrismaService.deliverable.create.mockResolvedValue(
                mockCreatedDeliverable,
            );

            const result = await service.create(studentId, createDto);

            expect(
                mockPrismaService.projectGroup.findFirst,
            ).toHaveBeenCalledWith({
                where: {
                    id: createDto.projectGroupId,
                    projectGroupStudents: {
                        some: {
                            studentId: studentId,
                        },
                    },
                },
            });

            expect(mockPrismaService.deliverable.create).toHaveBeenCalledWith({
                data: {
                    ...createDto,
                    uploadedByStudentId: studentId,
                },
                include: {
                    deliverableArchive: true,
                    uploadedByStudent: {
                        include: {
                            user: true,
                        },
                    },
                },
            });

            expect(result).toEqual(mockCreatedDeliverable);
        });

        it("should throw ForbiddenException when student is not in project group", async () => {
            const studentId = "student-1";
            const createDto = {
                name: "Test Deliverable",
                description: "Test Description",
                projectGroupId: "group-1",
            };

            mockPrismaService.projectGroup.findFirst.mockResolvedValue(null);

            await expect(service.create(studentId, createDto)).rejects.toThrow(
                ForbiddenException,
            );
        });
    });

    describe("attachFile", () => {
        const mockDeliverable = {
            id: "deliverable-1",
            uploadedByStudentId: "student-1",
            projectGroupId: "group-1",
            deadline: new Date("2025-12-31"),
            deliverableArchive: null,
        };

        beforeEach(() => {
            mockPrismaService.deliverable.findUnique.mockResolvedValue(
                mockDeliverable,
            );
            mockPrismaService.deliverableArchive.create.mockResolvedValue({
                id: "archive-1",
                name: "test.zip",
                path: "https://storage.googleapis.com/test-bucket/test.zip",
                fileSize: 1024,
                deliverableId: "deliverable-1",
            });
        });

        it("should attach file and perform validation successfully", async () => {
            const studentId = "student-1";
            const fileUrl =
                "https://storage.googleapis.com/test-bucket/test.zip";
            const fileName = "test.zip";
            const fileSize = 1024;

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
                summary: { totalRules: 1, passedRules: 1, failedRules: 0 },
            };

            const mockBuffer = Buffer.from("mock zip content");
            const mockResponse = {
                ok: true,
                arrayBuffer: jest.fn().mockResolvedValue(mockBuffer.buffer),
            };

            (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
            mockValidationService.validateDeliverable.mockResolvedValue(
                mockValidationResult,
            );
            mockPrismaService.projectGroupResult.findFirst.mockResolvedValue(
                null,
            );
            mockPrismaService.projectGroupResult.create.mockResolvedValue({
                id: "result-1",
                projectGroupId: "group-1",
            });

            const result = await service.attachFile(
                mockDeliverable.id,
                studentId,
                fileUrl,
                fileName,
                fileSize,
            );

            expect(
                mockPrismaService.deliverableArchive.create,
            ).toHaveBeenCalledWith({
                data: {
                    name: fileName,
                    path: fileUrl,
                    fileSize: fileSize,
                    deliverableId: mockDeliverable.id,
                },
            });

            expect(global.fetch).toHaveBeenCalledWith(fileUrl);
            expect(
                mockValidationService.validateDeliverable,
            ).toHaveBeenCalledWith(
                mockDeliverable.id,
                fileUrl,
                expect.any(Buffer),
            );

            expect(result).toBeDefined();
        });

        it("should throw ForbiddenException when student does not own deliverable", async () => {
            const wrongStudentId = "student-2";
            const fileUrl =
                "https://storage.googleapis.com/test-bucket/test.zip";
            const fileName = "test.zip";

            await expect(
                service.attachFile(
                    mockDeliverable.id,
                    wrongStudentId,
                    fileUrl,
                    fileName,
                ),
            ).rejects.toThrow(ForbiddenException);
        });

        it("should handle validation errors gracefully", async () => {
            const studentId = "student-1";
            const fileUrl =
                "https://storage.googleapis.com/test-bucket/test.zip";
            const fileName = "test.zip";

            const mockResponse = {
                ok: false,
                statusText: "Not Found",
            };

            (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
            const consoleSpy = jest
                .spyOn(console, "error")
                .mockImplementation();

            const result = await service.attachFile(
                mockDeliverable.id,
                studentId,
                fileUrl,
                fileName,
            );

            expect(consoleSpy).toHaveBeenCalledWith(
                "Validation error during file attachment:",
                expect.any(Error),
            );
            expect(result).toBeDefined(); // Should still return the archive

            consoleSpy.mockRestore();
        });

        it("should delete existing archive before creating new one", async () => {
            const deliverableWithArchive = {
                ...mockDeliverable,
                deliverableArchive: {
                    id: "existing-archive",
                    name: "old.zip",
                },
            };

            mockPrismaService.deliverable.findUnique.mockResolvedValue(
                deliverableWithArchive,
            );

            const studentId = "student-1";
            const fileUrl =
                "https://storage.googleapis.com/test-bucket/new.zip";
            const fileName = "new.zip";

            await service.attachFile(
                mockDeliverable.id,
                studentId,
                fileUrl,
                fileName,
            );

            expect(
                mockPrismaService.deliverableArchive.delete,
            ).toHaveBeenCalledWith({
                where: { deliverableId: mockDeliverable.id },
            });
        });
    });

    describe("getDeliverableValidationResults", () => {
        it("should return validation results for a deliverable", async () => {
            const deliverableId = "deliverable-1";
            const mockDeliverable = {
                id: deliverableId,
                projectGroupId: "group-1",
            };

            const mockValidationResults = {
                id: "result-1",
                projectGroupId: "group-1",
                deliverableRuleResults: [
                    {
                        id: "rule-result-1",
                        isRuleRespected: true,
                        deliverableRule: {
                            id: "rule-1",
                            ruleType: "MAX_SIZE_FILE",
                            ruleMaxSizeFile: { maxSize: 1024 * 1024 },
                        },
                    },
                ],
            };

            mockPrismaService.deliverable.findUnique.mockResolvedValue(
                mockDeliverable,
            );
            mockPrismaService.projectGroupResult.findFirst.mockResolvedValue(
                mockValidationResults,
            );

            const result =
                await service.getDeliverableValidationResults(deliverableId);

            expect(
                mockPrismaService.projectGroupResult.findFirst,
            ).toHaveBeenCalledWith({
                where: { projectGroupId: "group-1" },
                include: {
                    deliverableRuleResults: {
                        include: {
                            deliverableRule: {
                                include: {
                                    ruleMaxSizeFile: true,
                                    ruleFilePresence: true,
                                    ruleFileContentMatch: true,
                                    ruleFolderStructure: true,
                                },
                            },
                        },
                    },
                },
            });

            expect(result).toEqual(mockValidationResults);
        });
    });
});
