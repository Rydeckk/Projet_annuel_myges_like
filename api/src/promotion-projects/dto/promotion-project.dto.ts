import { ProjectGroupRule } from "@prisma/client";
import { IsBoolean, IsEnum, IsNumber, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class CreatePromotionProjectDto {
    @IsNumber()
    minPerGroup: number;

    @IsNumber()
    maxPerGroup: number;

    @IsBoolean()
    allowLateSubmission: boolean;

    @IsBoolean()
    isReportRequired: boolean;

    @IsEnum(ProjectGroupRule)
    projectGroupRule: ProjectGroupRule;

    @IsUUID()
    projectId: UUID;

    @IsUUID()
    promotionId: UUID;
}
