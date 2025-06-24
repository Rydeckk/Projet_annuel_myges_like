import { OmitType, PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateProjectGroupDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsUUID()
    promotionProjectId: string;
}

export class UpdateProjectGroupDto extends PartialType(
    OmitType(CreateProjectGroupDto, ["promotionProjectId"]),
) {}
