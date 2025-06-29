import { OmitType, PartialType } from "@nestjs/mapped-types";
import { ProjectGroupRule } from "@prisma/client";
import {
    IsBoolean,
    IsDateString,
    IsEnum,
    IsNumber,
    IsUUID,
    Validate,
} from "class-validator";
import { UUID } from "crypto";
import {
    DatesNotEqualConstraint,
    EndDateAfterStartDateConstraint,
    NotInPastConstraint,
} from "decorators/date-validator.decorator";

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

    @IsDateString()
    @Validate(NotInPastConstraint)
    @Validate(DatesNotEqualConstraint)
    startDate: Date;

    @IsDateString()
    @Validate(EndDateAfterStartDateConstraint)
    @Validate(DatesNotEqualConstraint)
    endDate: Date;
}

export class UpdatePromotionProjectDto extends OmitType(
    PartialType(CreatePromotionProjectDto),
    ["projectId", "promotionId"],
) {}
