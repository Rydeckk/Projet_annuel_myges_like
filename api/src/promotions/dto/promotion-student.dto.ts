import { IsEmail, IsNotEmpty, IsString, IsUUID } from "class-validator";

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
    promotionId: string;
}
