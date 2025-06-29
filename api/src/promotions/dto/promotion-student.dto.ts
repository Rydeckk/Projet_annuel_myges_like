import { IsEmail, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class CreatePromotionStudentDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsUUID()
    promotionId: UUID;
}
