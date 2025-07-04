import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import {
    CreateDeliverableDto,
    UpdateDeliverableDto,
    SubmitDeliverableDto,
} from "./dto/deliverable.dto";
import { DeliverableValidationService } from "src/deliverable-rules/deliverable-validation.service";
import { GoogleCloudStorageService } from "src/google-cloud-storage/google-cloud-storage.service";
import { DeliverableValidationResult } from "src/deliverable-rules/deliverable-validation.service";

interface DeliverableWithProject {
    id: string;
    deadline?: Date | null;
    submitAt?: Date | null;
    projectGroupId: string;
    uploadedByStudentId: string;
    projectGroup: {
        promotionProject: {
            allowLateSubmission: boolean;
        };
    };
}

@Injectable()
export class DeliverablesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly validationService: DeliverableValidationService,
        private readonly storageService: GoogleCloudStorageService,
    ) {}

    async create(
        studentId: string,
        createDeliverableDto: CreateDeliverableDto,
    ) {
        // Verify student is in the project group
        const projectGroup = await this.prisma.projectGroup.findFirst({
            where: {
                id: createDeliverableDto.projectGroupId,
                projectGroupStudents: {
                    some: {
                        studentId: studentId,
                    },
                },
            },
        });

        if (!projectGroup) {
            throw new ForbiddenException(
                "You are not part of this project group",
            );
        }

        return this.prisma.deliverable.create({
            data: {
                ...createDeliverableDto,
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
    }

    async findByProjectGroup(projectGroupId: string) {
        return this.prisma.deliverable.findMany({
            where: {
                projectGroupId,
            },
            include: {
                deliverableArchive: true,
                uploadedByStudent: {
                    include: {
                        user: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async findOne(id: string) {
        const deliverable = await this.prisma.deliverable.findUnique({
            where: { id },
            include: {
                deliverableArchive: true,
                uploadedByStudent: {
                    include: {
                        user: true,
                    },
                },
                projectGroup: {
                    include: {
                        projectGroupStudents: {
                            include: {
                                student: true,
                            },
                        },
                    },
                },
            },
        });

        if (!deliverable) {
            throw new NotFoundException("Deliverable not found");
        }

        return deliverable;
    }

    async update(
        id: string,
        studentId: string,
        updateDeliverableDto: UpdateDeliverableDto,
    ) {
        const deliverable = await this.findOne(id);

        // Check if student owns this deliverable
        if (deliverable.uploadedByStudentId !== studentId) {
            throw new ForbiddenException(
                "You can only update your own deliverables",
            );
        }

        return this.prisma.deliverable.update({
            where: { id },
            data: updateDeliverableDto,
            include: {
                deliverableArchive: true,
                uploadedByStudent: {
                    include: {
                        user: true,
                    },
                },
            },
        });
    }

    async remove(id: string, studentId: string) {
        const deliverable = await this.findOne(id);

        // Check if student owns this deliverable
        if (deliverable.uploadedByStudentId !== studentId) {
            throw new ForbiddenException(
                "You can only delete your own deliverables",
            );
        }

        return this.prisma.deliverable.delete({
            where: { id },
        });
    }

    async attachFile(
        deliverableId: string,
        studentId: string,
        fileUrl: string,
        fileName: string,
        fileSize?: number,
    ) {
        const deliverable = await this.findOne(deliverableId);

        // Check if student owns this deliverable
        if (deliverable.uploadedByStudentId !== studentId) {
            throw new ForbiddenException(
                "You can only attach files to your own deliverables",
            );
        }

        // Delete existing archive if any
        if (deliverable.deliverableArchive) {
            await this.prisma.deliverableArchive.delete({
                where: { deliverableId },
            });
        }

        // Create new archive record
        const archive = await this.prisma.deliverableArchive.create({
            data: {
                name: fileName,
                path: fileUrl,
                fileSize: fileSize || 0,
                deliverableId,
            },
        });

        // Perform automatic validation after file attachment
        try {
            const validationResult = await this.validateDeliverableWithFile(
                deliverableId,
                fileUrl,
            );

            // Save validation results
            await this.saveValidationResults(deliverableId, validationResult);

            // Check if submission should be blocked based on validation and project rules
            await this.checkSubmissionRules(
                deliverable as unknown as DeliverableWithProject,
                validationResult,
            );
        } catch (validationError) {
            // Log validation error but don't block the submission
            console.error(
                "Validation error during file attachment:",
                validationError,
            );
        }

        return archive;
    }

    async downloadArchive(deliverableId: string, studentId: string) {
        const deliverable = await this.findOne(deliverableId);

        // Check if student is in the same project group or owns the deliverable
        const isInSameGroup =
            deliverable.projectGroup.projectGroupStudents.some(
                (pgs) => pgs.student.id === studentId,
            );
        const isOwner = deliverable.uploadedByStudentId === studentId;

        if (!isInSameGroup && !isOwner) {
            throw new ForbiddenException(
                "You cannot download this deliverable",
            );
        }

        if (!deliverable.deliverableArchive) {
            throw new NotFoundException(
                "No archive found for this deliverable",
            );
        }

        return {
            url: deliverable.deliverableArchive.path,
            filename: deliverable.deliverableArchive.name,
            size: deliverable.deliverableArchive.fileSize,
        };
    }

    private async validateDeliverableWithFile(
        deliverableId: string,
        fileUrl: string,
    ): Promise<DeliverableValidationResult> {
        // Download file content from Google Cloud Storage for validation
        const fileBuffer = await this.downloadFileForValidation(fileUrl);

        return this.validationService.validateDeliverable(
            deliverableId,
            fileUrl,
            fileBuffer,
        );
    }

    private async downloadFileForValidation(fileUrl: string): Promise<Buffer> {
        try {
            // For now, we'll use a simple fetch approach
            // In production, you might want to use the GCS SDK directly
            const response = await fetch(fileUrl);
            if (!response.ok) {
                throw new Error(
                    `Failed to download file: ${response.statusText}`,
                );
            }

            const arrayBuffer = await response.arrayBuffer();
            return Buffer.from(arrayBuffer);
        } catch (error) {
            console.error("Error downloading file for validation:", error);
            throw new Error("Failed to download file for validation");
        }
    }

    private async saveValidationResults(
        deliverableId: string,
        validationResult: DeliverableValidationResult,
    ): Promise<void> {
        const deliverable = await this.findOne(deliverableId);

        // Create or update project group result
        const existingResult = await this.prisma.projectGroupResult.findFirst({
            where: { projectGroupId: deliverable.projectGroupId },
        });

        const projectGroupResult =
            existingResult ||
            (await this.prisma.projectGroupResult.create({
                data: {
                    projectGroupId: deliverable.projectGroupId,
                    isSubmittedInTime: this.isSubmittedInTime(
                        deliverable as unknown as DeliverableWithProject,
                    ),
                    similarityRate: 0, // Will be updated by similarity analysis later
                },
            }));

        // Save individual rule results
        for (const result of validationResult.results) {
            await this.prisma.deliverableRuleResult.upsert({
                where: {
                    projectGroupResultId_deliverableRuleId: {
                        projectGroupResultId: projectGroupResult.id,
                        deliverableRuleId: result.ruleId,
                    },
                },
                update: {
                    isRuleRespected: result.isValid,
                },
                create: {
                    projectGroupResultId: projectGroupResult.id,
                    deliverableRuleId: result.ruleId,
                    isRuleRespected: result.isValid,
                },
            });
        }
    }

    private async checkSubmissionRules(
        deliverable: DeliverableWithProject,
        validationResult: DeliverableValidationResult,
    ): Promise<void> {
        // Get promotion project details
        const promotionProject = await this.prisma.promotionProject.findFirst({
            where: {
                projectGroups: {
                    some: {
                        id: deliverable.projectGroupId,
                    },
                },
            },
        });

        if (!promotionProject) {
            return; // No rules to check
        }

        // Check deadline and late submission rules
        const now = new Date();
        const isLate =
            deliverable.deadline && now > new Date(deliverable.deadline);

        if (isLate && !promotionProject.allowLateSubmission) {
            throw new BadRequestException(
                "Late submission not allowed for this project",
            );
        }

        // For now, we don't block on validation failures
        // In future iterations, this could be configurable per project
        if (!validationResult.isValid) {
            console.warn(
                `Deliverable ${deliverable.id} has validation failures but submission is allowed`,
                {
                    failedRules: validationResult.results
                        .filter((r) => !r.isValid)
                        .map((r) => r.ruleType),
                },
            );
        }
    }

    private isSubmittedInTime(deliverable: DeliverableWithProject): boolean {
        if (!deliverable.deadline) {
            return true; // No deadline means always on time
        }

        const now = new Date();
        return now <= new Date(deliverable.deadline);
    }

    async getDeliverableValidationResults(deliverableId: string) {
        const deliverable = await this.findOne(deliverableId);

        const projectGroupResult =
            await this.prisma.projectGroupResult.findFirst({
                where: { projectGroupId: deliverable.projectGroupId },
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

        return projectGroupResult;
    }

    async attachGit(
        deliverableId: string,
        studentId: string,
        gitUrl: string,
        branch = "main",
    ) {
        const deliverable = await this.findOne(deliverableId);

        // Check ownership
        if (deliverable.uploadedByStudentId !== studentId) {
            throw new ForbiddenException(
                "You can only modify your own deliverables",
            );
        }

        // Validate Git URL (basic check)
        if (!this.isValidGitUrl(gitUrl)) {
            throw new BadRequestException("Invalid Git URL format");
        }

        // Update deliverable with Git information
        const updated = await this.prisma.deliverable.update({
            where: { id: deliverableId },
            data: {
                deliverableGitRepo: {
                    upsert: {
                        create: {
                            repositoryUrl: gitUrl,
                            branch,
                        },
                        update: {
                            repositoryUrl: gitUrl,
                            branch,
                        },
                    },
                },
            },
            include: {
                deliverableGitRepo: true,
                uploadedByStudent: {
                    include: { user: true },
                },
            },
        });

        return updated;
    }

    async submit(
        deliverableId: string,
        studentId: string,
        submitDto: SubmitDeliverableDto,
    ) {
        const deliverable = await this.findOne(deliverableId);

        // Check ownership
        if (deliverable.uploadedByStudentId !== studentId) {
            throw new ForbiddenException(
                "You can only submit your own deliverables",
            );
        }

        // Check if already submitted
        if (deliverable.submitAt) {
            throw new BadRequestException("Deliverable already submitted");
        }

        // Check deadline
        const isLate = !this.isWithinDeadline(
            deliverable as unknown as DeliverableWithProject,
        );
        if (isLate && !submitDto.submitLate) {
            throw new BadRequestException(
                "Deadline passed. Use submitLate flag to confirm late submission",
            );
        }

        // Calculate malus if late (removed for now as schema doesn't support it)
        // let malus = 0;
        // if (isLate) {
        //     malus = this.calculateLateMalus(deliverable as unknown as DeliverableWithProject);
        // }

        // Submit deliverable
        const submitted = await this.prisma.deliverable.update({
            where: { id: deliverableId },
            data: {
                submitAt: new Date(),
            },
            include: {
                deliverableArchive: true,
                deliverableGitRepo: true,
                uploadedByStudent: {
                    include: { user: true },
                },
            },
        });

        return submitted;
    }

    async checkCompliance(deliverableId: string) {
        const validationResults =
            await this.getDeliverableValidationResults(deliverableId);

        if (!validationResults) {
            return {
                compliant: false,
                message: "No validation results found",
                rules: [],
            };
        }

        const ruleResults = validationResults.deliverableRuleResults;
        const totalRules = ruleResults.length;
        const passedRules = ruleResults.filter((r) => r.isRuleRespected).length;
        const failedRules = totalRules - passedRules;

        return {
            compliant: failedRules === 0,
            totalRules,
            passedRules,
            failedRules,
            rules: ruleResults.map((result) => ({
                ruleId: result.deliverableRule.id,
                ruleType: result.deliverableRule.ruleType,
                respected: result.isRuleRespected,
                message: null,
            })),
        };
    }

    async validateAgainstRules(deliverableId: string, studentId: string) {
        const deliverable = await this.findOne(deliverableId);

        // Check ownership or group membership
        const isInGroup = deliverable.projectGroup.projectGroupStudents.some(
            (pgs) => pgs.student.id === studentId,
        );
        if (!isInGroup) {
            throw new ForbiddenException("Access denied to this deliverable");
        }

        // Trigger validation if file exists
        if (deliverable.deliverableArchive) {
            const validationResult = await this.validateDeliverableWithFile(
                deliverableId,
                deliverable.deliverableArchive.path,
            );

            await this.saveValidationResults(deliverableId, validationResult);

            return validationResult;
        } else {
            throw new BadRequestException("No file attached to validate");
        }
    }

    // Helper methods

    private isValidGitUrl(url: string): boolean {
        const gitUrlPattern =
            /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?\.git$/;
        const githubPattern = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/;
        return gitUrlPattern.test(url) || githubPattern.test(url);
    }

    private calculateLateMalus(deliverable: DeliverableWithProject): number {
        if (!deliverable.deadline) {
            return 0;
        }
        const deadline = new Date(deliverable.deadline);
        const now = new Date();
        const hoursLate = Math.ceil(
            (now.getTime() - deadline.getTime()) / (1000 * 60 * 60),
        );

        // Default malus: 1 point per hour late
        const malusPerHour = 1;
        return Math.max(0, hoursLate * malusPerHour);
    }

    private isWithinDeadline(deliverable: DeliverableWithProject): boolean {
        if (!deliverable.deadline) {
            return true; // No deadline means always on time
        }

        const now = new Date();
        return now <= new Date(deliverable.deadline);
    }
}
