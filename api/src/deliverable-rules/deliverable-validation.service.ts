import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { RuleType, MatchType } from "@prisma/client";

interface DeliverableWithArchive {
    id: string;
    deliverableArchive?: {
        fileSize: number;
    } | null;
}

interface RuleWithSpecificData {
    id: string;
    ruleType: RuleType;
    ruleMaxSizeFile?: {
        maxSize: number;
    } | null;
    ruleFilePresence?: {
        fileName: string;
    } | null;
    ruleFileContentMatch?: {
        fileName: string;
        match: string;
        matchType: MatchType;
    } | null;
    ruleFolderStructure?: {
        expectedStructure: string;
    } | null;
}

export interface ValidationResult {
    isValid: boolean;
    ruleId: string;
    ruleType: string;
    message: string;
    details?: any;
}

export interface DeliverableValidationResult {
    isValid: boolean;
    results: ValidationResult[];
    summary: {
        totalRules: number;
        passedRules: number;
        failedRules: number;
    };
}

@Injectable()
export class DeliverableValidationService {
    constructor(private readonly prisma: PrismaService) {}

    async validateDeliverable(
        deliverableId: string,
        filePath?: string,
        fileBuffer?: Buffer,
    ): Promise<DeliverableValidationResult> {
        // Get deliverable with its project rules
        const deliverable = await this.prisma.deliverable.findUnique({
            where: { id: deliverableId },
            include: {
                projectGroup: {
                    include: {
                        promotionProject: {
                            include: {
                                promotionProjectDeliverableRules: {
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
                        },
                    },
                },
                deliverableArchive: true,
            },
        });

        if (!deliverable) {
            throw new Error("Deliverable not found");
        }

        const rules =
            deliverable.projectGroup.promotionProject.promotionProjectDeliverableRules.map(
                (ppr) => ppr.deliverableRule,
            );

        const results: ValidationResult[] = [];

        // Validate each rule
        for (const rule of rules) {
            const result = this.validateSingleRule(
                rule,
                filePath,
                fileBuffer,
                deliverable,
            );
            results.push(result);
        }

        const passedRules = results.filter((r) => r.isValid).length;
        const failedRules = results.length - passedRules;

        return {
            isValid: failedRules === 0,
            results,
            summary: {
                totalRules: rules.length,
                passedRules,
                failedRules,
            },
        };
    }

    private validateSingleRule(
        rule: RuleWithSpecificData,
        filePath?: string,
        fileBuffer?: Buffer,
        deliverable?: DeliverableWithArchive,
    ): ValidationResult {
        const baseResult = {
            ruleId: rule.id,
            ruleType: rule.ruleType as string,
            isValid: false,
            message: "",
        };

        try {
            switch (rule.ruleType) {
                case RuleType.MAX_SIZE_FILE:
                    return this.validateMaxSizeFile(
                        rule.ruleMaxSizeFile,
                        deliverable,
                        baseResult,
                    );

                case RuleType.FILE_PRESENCE:
                    return this.validateFilePresence(
                        rule.ruleFilePresence,
                        filePath,
                        fileBuffer,
                        baseResult,
                    );

                case RuleType.FILE_CONTENT_MATCH:
                    return this.validateFileContentMatch(
                        rule.ruleFileContentMatch,
                        filePath,
                        fileBuffer,
                        baseResult,
                    );

                case RuleType.FOLDER_STRUCTURE:
                    return this.validateFolderStructure(
                        rule.ruleFolderStructure,
                        filePath,
                        fileBuffer,
                        baseResult,
                    );

                default:
                    return {
                        ...baseResult,
                        message: `Unsupported rule type: ${rule.ruleType as string}`,
                    };
            }
        } catch (error) {
            return {
                ...baseResult,
                message: `Validation error: ${error instanceof Error ? error.message : "Unknown error"}`,
            };
        }
    }

    private validateMaxSizeFile(
        rule: { maxSize: number } | null | undefined,
        deliverable: DeliverableWithArchive | undefined,
        baseResult: Partial<ValidationResult>,
    ): ValidationResult {
        if (!rule) {
            return {
                ...baseResult,
                isValid: false,
                message: "Max size rule data not found",
            } as ValidationResult;
        }

        const fileSize = deliverable?.deliverableArchive?.fileSize || 0;
        const maxSize = rule.maxSize;
        const isValid = fileSize <= maxSize;

        return {
            ...baseResult,
            isValid,
            message: isValid
                ? `File size ${this.formatBytes(fileSize)} is within limit`
                : `File size ${this.formatBytes(fileSize)} exceeds maximum of ${this.formatBytes(maxSize)}`,
            details: {
                actualSize: fileSize,
                maxSize,
                actualSizeFormatted: this.formatBytes(fileSize),
                maxSizeFormatted: this.formatBytes(maxSize),
            },
        } as ValidationResult;
    }

    private validateFilePresence(
        rule: { fileName: string } | null | undefined,
        filePath?: string,
        fileBuffer?: Buffer,
        baseResult?: Partial<ValidationResult>,
    ): ValidationResult {
        // TODO: Implement file presence validation
        // This would require extracting and analyzing the archive content
        return {
            ...baseResult,
            isValid: true,
            message: "File presence validation not yet implemented",
        } as ValidationResult;
    }

    private validateFileContentMatch(
        rule:
            | { fileName: string; match: string; matchType: MatchType }
            | null
            | undefined,
        filePath?: string,
        fileBuffer?: Buffer,
        baseResult?: Partial<ValidationResult>,
    ): ValidationResult {
        // TODO: Implement file content validation
        // This would require extracting specific files and checking their content
        return {
            ...baseResult,
            isValid: true,
            message: "File content validation not yet implemented",
        } as ValidationResult;
    }

    private validateFolderStructure(
        rule: { expectedStructure: string } | null | undefined,
        filePath?: string,
        fileBuffer?: Buffer,
        baseResult?: Partial<ValidationResult>,
    ): ValidationResult {
        // TODO: Implement folder structure validation
        // This would require extracting the archive and checking its structure
        return {
            ...baseResult,
            isValid: true,
            message: "Folder structure validation not yet implemented",
        } as ValidationResult;
    }

    private formatBytes(bytes: number): string {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    }
}
