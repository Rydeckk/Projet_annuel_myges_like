import {
    IsString,
    IsEnum,
    IsObject,
    ValidateNested,
    IsOptional,
    IsInt,
    Min,
    IsNotEmpty,
} from "class-validator";
import { Type } from "class-transformer";
import { RuleType, MatchType } from "@prisma/client";

// Base DTO for deliverable rules
export class CreateDeliverableRuleDto {
    @IsEnum(RuleType)
    ruleType: RuleType;

    @IsObject()
    @ValidateNested()
    @Type(() => Object)
    ruleData:
        | RuleMaxSizeDto
        | RuleFilePresenceDto
        | RuleFileContentMatchDto
        | RuleFolderStructureDto;
}

export class UpdateDeliverableRuleDto {
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => Object)
    ruleData?:
        | RuleMaxSizeDto
        | RuleFilePresenceDto
        | RuleFileContentMatchDto
        | RuleFolderStructureDto;
}

// Specific rule DTOs
export class RuleMaxSizeDto {
    @IsInt()
    @Min(1)
    maxSize: number; // Size in bytes
}

export class RuleFilePresenceDto {
    @IsString()
    @IsNotEmpty()
    fileName: string;
}

export class RuleFileContentMatchDto {
    @IsString()
    @IsNotEmpty()
    fileName: string;

    @IsString()
    @IsNotEmpty()
    match: string;

    @IsEnum(MatchType)
    matchType: MatchType;
}

export class RuleFolderStructureDto {
    @IsObject()
    expectedStructure: FolderStructure;
}

// Helper interfaces for folder structure
export interface FolderStructure {
    type: "folder" | "file";
    name: string;
    required: boolean;
    children?: FolderStructure[];
    pattern?: string; // For files, optional regex pattern for name
}

// DTO for associating rules with promotion projects
export class AssignRuleToPromotionProjectDto {
    @IsString()
    @IsNotEmpty()
    deliverableRuleId: string;

    @IsString()
    @IsNotEmpty()
    promotionProjectId: string;
}

// DTO for validation testing
export class TestRuleValidationDto {
    @IsString()
    @IsNotEmpty()
    ruleId: string;

    @IsOptional()
    @IsString()
    filePath?: string;

    @IsOptional()
    @IsString()
    deliverableId?: string;
}
