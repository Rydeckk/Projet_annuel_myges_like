import { OmitType } from "@nestjs/mapped-types";
import { IsUUID } from "class-validator";

export class CreateProjectGroupStudentDto {
    @IsUUID()
    projectGroupId: string;

    @IsUUID()
    studentId: string;

    @IsUUID()
    promotionProjectId?: string;
}

export class DeleteProjectGroupStudentDto extends OmitType(
    CreateProjectGroupStudentDto,
    ["promotionProjectId"],
) {}
