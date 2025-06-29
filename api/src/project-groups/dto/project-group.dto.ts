import { OmitType, PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class CreateProjectGroupDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsUUID()
    promotionProjectId: string;
}

export class UpdateProjectGroupDto extends PartialType(
    OmitType(CreateProjectGroupDto, ["promotionProjectId"]),
) {
    @IsOptional()
    @IsUUID("4", { each: true })
    selectedProjectGroupStudentIds: UUID[];
}
