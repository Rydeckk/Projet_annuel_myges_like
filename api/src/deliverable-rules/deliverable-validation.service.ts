import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { RuleType, MatchType } from "@prisma/client";
import * as JSZip from "jszip";

interface FolderStructureNode {
    [key: string]: FolderStructureNode | "file";
}

interface StructureValidationResult {
    isValid: boolean;
    message: string;
    missingPaths: string[];
    extraPaths: string[];
}

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
            const result = await this.validateSingleRule(
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

    private async validateSingleRule(
        rule: RuleWithSpecificData,
        filePath?: string,
        fileBuffer?: Buffer,
        deliverable?: DeliverableWithArchive,
    ): Promise<ValidationResult> {
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
                    return await this.validateFilePresence(
                        rule.ruleFilePresence,
                        filePath,
                        fileBuffer,
                        baseResult,
                    );

                case RuleType.FILE_CONTENT_MATCH:
                    return await this.validateFileContentMatch(
                        rule.ruleFileContentMatch,
                        filePath,
                        fileBuffer,
                        baseResult,
                    );

                case RuleType.FOLDER_STRUCTURE:
                    return await this.validateFolderStructure(
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

    private async validateFilePresence(
        rule: { fileName: string } | null | undefined,
        filePath?: string,
        fileBuffer?: Buffer,
        baseResult?: Partial<ValidationResult>,
    ): Promise<ValidationResult> {
        if (!rule) {
            return {
                ...baseResult,
                isValid: false,
                message: "File presence rule data not found",
            } as ValidationResult;
        }

        if (!fileBuffer) {
            return {
                ...baseResult,
                isValid: false,
                message: "No file buffer provided for validation",
            } as ValidationResult;
        }

        try {
            const zip = await JSZip.loadAsync(fileBuffer);
            const files = Object.keys(zip.files);
            const requiredFile = rule.fileName;

            // Check for exact match or pattern match
            const fileExists = files.some((fileName) => {
                // Remove directory path for comparison
                const baseName = fileName.split("/").pop() || "";
                return baseName === requiredFile || fileName === requiredFile;
            });

            return {
                ...baseResult,
                isValid: fileExists,
                message: fileExists
                    ? `Required file '${requiredFile}' found`
                    : `Required file '${requiredFile}' not found`,
                details: {
                    requiredFile,
                    foundFiles: files.filter((f) => !f.endsWith("/")),
                },
            } as ValidationResult;
        } catch (error) {
            return {
                ...baseResult,
                isValid: false,
                message: `Error reading archive: ${error instanceof Error ? error.message : "Unknown error"}`,
            } as ValidationResult;
        }
    }

    private async validateFileContentMatch(
        rule:
            | { fileName: string; match: string; matchType: MatchType }
            | null
            | undefined,
        filePath?: string,
        fileBuffer?: Buffer,
        baseResult?: Partial<ValidationResult>,
    ): Promise<ValidationResult> {
        if (!rule) {
            return {
                ...baseResult,
                isValid: false,
                message: "File content rule data not found",
            } as ValidationResult;
        }

        if (!fileBuffer) {
            return {
                ...baseResult,
                isValid: false,
                message: "No file buffer provided for validation",
            } as ValidationResult;
        }

        try {
            const zip = await JSZip.loadAsync(fileBuffer);
            const targetFile = zip.file(rule.fileName);

            if (!targetFile) {
                return {
                    ...baseResult,
                    isValid: false,
                    message: `File '${rule.fileName}' not found in archive`,
                } as ValidationResult;
            }

            const content = await targetFile.async("text");
            let isMatch = false;

            switch (rule.matchType) {
                case MatchType.CONTAINS:
                    isMatch = content.includes(rule.match);
                    break;
                case MatchType.REGEX:
                    try {
                        const regex = new RegExp(rule.match);
                        isMatch = regex.test(content);
                    } catch {
                        return {
                            ...baseResult,
                            isValid: false,
                            message: `Invalid regex pattern: ${rule.match}`,
                        } as ValidationResult;
                    }
                    break;
                case MatchType.EXACT:
                    isMatch = content.trim() === rule.match;
                    break;
            }

            return {
                ...baseResult,
                isValid: isMatch,
                message: isMatch
                    ? `Content matches ${rule.matchType.toLowerCase()} pattern`
                    : `Content does not match ${rule.matchType.toLowerCase()} pattern`,
                details: {
                    fileName: rule.fileName,
                    matchType: rule.matchType,
                    expectedPattern: rule.match,
                    contentPreview:
                        content.substring(0, 200) +
                        (content.length > 200 ? "..." : ""),
                },
            } as ValidationResult;
        } catch (error) {
            return {
                ...baseResult,
                isValid: false,
                message: `Error reading file content: ${error instanceof Error ? error.message : "Unknown error"}`,
            } as ValidationResult;
        }
    }

    private async validateFolderStructure(
        rule: { expectedStructure: string } | null | undefined,
        filePath?: string,
        fileBuffer?: Buffer,
        baseResult?: Partial<ValidationResult>,
    ): Promise<ValidationResult> {
        if (!rule) {
            return {
                ...baseResult,
                isValid: false,
                message: "Folder structure rule data not found",
            } as ValidationResult;
        }

        if (!fileBuffer) {
            return {
                ...baseResult,
                isValid: false,
                message: "No file buffer provided for validation",
            } as ValidationResult;
        }

        try {
            const zip = await JSZip.loadAsync(fileBuffer);
            const files = Object.keys(zip.files);

            // Parse expected structure from JSON
            let expectedStructure: FolderStructureNode;
            try {
                expectedStructure = JSON.parse(
                    rule.expectedStructure,
                ) as FolderStructureNode;
            } catch {
                return {
                    ...baseResult,
                    isValid: false,
                    message: "Invalid expected structure JSON format",
                } as ValidationResult;
            }

            // Build actual structure from archive
            const actualStructure = this.buildFolderStructure(files);

            // Validate structure
            const validation = this.validateStructureRecursive(
                expectedStructure,
                actualStructure,
            );

            return {
                ...baseResult,
                isValid: validation.isValid,
                message: validation.message,
                details: {
                    expectedStructure,
                    actualStructure,
                    missingPaths: validation.missingPaths,
                    extraPaths: validation.extraPaths,
                },
            } as ValidationResult;
        } catch (error) {
            return {
                ...baseResult,
                isValid: false,
                message: `Error validating folder structure: ${error instanceof Error ? error.message : "Unknown error"}`,
            } as ValidationResult;
        }
    }

    private formatBytes(bytes: number): string {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    }

    private buildFolderStructure(files: string[]): FolderStructureNode {
        const structure: FolderStructureNode = {};

        for (const filePath of files) {
            const parts = filePath.split("/").filter((part) => part.length > 0);
            let current = structure;

            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                const isLastPart = i === parts.length - 1;

                if (isLastPart && !filePath.endsWith("/")) {
                    // It's a file
                    current[part] = "file";
                } else {
                    // It's a directory
                    if (!current[part] || current[part] === "file") {
                        current[part] = {};
                    }
                    const nextNode = current[part];
                    if (typeof nextNode === "object") {
                        current = nextNode;
                    }
                }
            }
        }

        return structure;
    }

    private validateStructureRecursive(
        expected: FolderStructureNode,
        actual: FolderStructureNode,
        currentPath = "",
    ): StructureValidationResult {
        const missingPaths: string[] = [];
        const extraPaths: string[] = [];

        // Check for missing required items
        for (const key in expected) {
            const fullPath = currentPath ? `${currentPath}/${key}` : key;
            const expectedNode = expected[key];
            const actualNode = actual[key];

            if (!(key in actual)) {
                missingPaths.push(fullPath);
                continue;
            }

            if (typeof expectedNode === "object" && expectedNode !== null) {
                if (typeof actualNode !== "object" || actualNode === "file") {
                    missingPaths.push(fullPath);
                } else {
                    const subValidation = this.validateStructureRecursive(
                        expectedNode,
                        actualNode,
                        fullPath,
                    );
                    missingPaths.push(...subValidation.missingPaths);
                    extraPaths.push(...subValidation.extraPaths);
                }
            }
        }

        const isValid = missingPaths.length === 0;
        const message = isValid
            ? "Folder structure matches expected format"
            : `Missing required paths: ${missingPaths.join(", ")}`;

        return { isValid, message, missingPaths, extraPaths };
    }
}
