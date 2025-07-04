import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from "@nestjs/common";
import { DeliverableRulesService } from "./deliverable-rules.service";
import {
    CreateDeliverableRuleDto,
    UpdateDeliverableRuleDto,
} from "./dto/deliverable-rule.dto";
import { JwtAuthGuard } from "src/auth/strategies/jwt/jwt-auth.guard";

@Controller("deliverable-rules")
@UseGuards(JwtAuthGuard)
export class DeliverableRulesController {
    constructor(
        private readonly deliverableRulesService: DeliverableRulesService,
    ) {}

    @Post()
    create(@Body() createDeliverableRuleDto: CreateDeliverableRuleDto) {
        return this.deliverableRulesService.create(createDeliverableRuleDto);
    }

    @Get()
    findAll() {
        return this.deliverableRulesService.findAll();
    }

    @Get("promotion-project/:promotionProjectId")
    findByPromotionProject(
        @Param("promotionProjectId") promotionProjectId: string,
    ) {
        return this.deliverableRulesService.findByPromotionProject(
            promotionProjectId,
        );
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.deliverableRulesService.findOne(id);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateDeliverableRuleDto: UpdateDeliverableRuleDto,
    ) {
        return this.deliverableRulesService.update(
            id,
            updateDeliverableRuleDto,
        );
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.deliverableRulesService.remove(id);
    }
}
