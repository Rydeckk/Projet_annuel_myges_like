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
    description?: string;

    @IsNotEmpty()
    @IsUUID()
    promotionProjectId: string;
}

export class UpdateReportSectionsDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    order?: number;
}
