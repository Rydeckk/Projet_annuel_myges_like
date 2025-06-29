import { PartialType } from "@nestjs/mapped-types";
import { ProjectVisibility } from "@prisma/client";
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from "class-validator";

export class CreateProjectDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsEnum(ProjectVisibility)
    projectVisibility: ProjectVisibility;

    @IsOptional()
    @IsString()
    fileName: string;

    @IsNumber()
    @IsOptional()
    fileSize: number;

    @IsOptional()
    @IsString()
    path: string;
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
