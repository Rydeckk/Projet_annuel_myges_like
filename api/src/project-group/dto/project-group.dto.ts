import { IsNotEmpty, IsString } from "class-validator";

export class CreateProjectGroupDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    promotionProjectId: string;
}

export class CreateAllProjectGroupsDto {
    @IsNotEmpty()
    @IsString()
    promotionProjectId: string;
}

export class CreateProjectGroupStudentDto {
    @IsNotEmpty()
    @IsString()
    projectGroupId: string;

    @IsNotEmpty()
    @IsString()
    studentId: string;
}
