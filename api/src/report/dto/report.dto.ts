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
