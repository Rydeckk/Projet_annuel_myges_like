import { PartialType } from "@nestjs/mapped-types";
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
} from "class-validator";

export class CreateReportSectionsDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsUUID()
    promotionProjectId: string;
}

export class UpdateReportSectionsDto extends PartialType(
    CreateReportSectionsDto,
) {
    @IsOptional()
    @IsNumber()
    order: number;

    @IsUUID()
    promotionProjectId: string;
}

export class DeleteReportSectionDto {
    @IsUUID()
    promotionProjectId: string;
}
