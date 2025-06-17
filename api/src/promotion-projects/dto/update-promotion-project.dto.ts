import { PartialType } from "@nestjs/mapped-types";
import { CreatePromotionProjectDto } from "./create-promotion-project.dto";

export class UpdatePromotionProjectDto extends PartialType(
    CreatePromotionProjectDto,
) {}
