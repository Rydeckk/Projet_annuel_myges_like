import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateReportDto {
    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsString()
    projectGroupId: string;
}

export class UpdateReportDto extends PartialType(CreateReportDto) {}
