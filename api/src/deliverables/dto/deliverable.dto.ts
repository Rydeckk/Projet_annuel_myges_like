import {
    IsString,
    IsOptional,
    IsUUID,
    IsUrl,
    IsBoolean,
} from "class-validator";

export class CreateDeliverableDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsUUID()
    projectGroupId: string;
}

export class UpdateDeliverableDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;
}

export class AttachFileToDeliverableDto {
    @IsString()
    fileUrl: string;

    @IsString()
    fileName: string;

    @IsOptional()
    fileSize?: number;
}

export class AttachGitToDeliverableDto {
    @IsUrl()
    gitUrl: string;

    @IsOptional()
    @IsString()
    branch?: string;
}

export class SubmitDeliverableDto {
    @IsOptional()
    @IsString()
    comment?: string;

    @IsOptional()
    @IsBoolean()
    submitLate?: boolean;
}
