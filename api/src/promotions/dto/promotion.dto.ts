import { PartialType } from "@nestjs/mapped-types";
import { IsDateString, IsNotEmpty, IsString, Validate } from "class-validator";
import {
    DatesNotEqualConstraint,
    EndDateAfterStartDateConstraint,
    NotInPastConstraint,
} from "decorators/date-validator.decorator";

export class CreatePromotionDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsDateString()
    @Validate(NotInPastConstraint)
    @Validate(DatesNotEqualConstraint)
    startDate: Date;

    @IsDateString()
    @Validate(EndDateAfterStartDateConstraint)
    @Validate(DatesNotEqualConstraint)
    endDate: Date;
}

export class UpdatePromotionDto extends PartialType(CreatePromotionDto) {}
