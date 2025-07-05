import { IsUUID } from "class-validator";

export class AnalyzeProjectDto {
    @IsUUID()
    promotionProjectId: string;
}
