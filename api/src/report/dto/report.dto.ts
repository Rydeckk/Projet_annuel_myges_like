import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateReportDto {
    @IsNotEmpty()
    @IsString()
    content: string;

    @IsUUID()
    projectGroupId: string;

    @IsUUID()
    reportSectionId: string;
}

export class UpdateReportDto extends PartialType(CreateReportDto) {}
