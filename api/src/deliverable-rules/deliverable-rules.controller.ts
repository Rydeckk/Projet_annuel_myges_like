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
import { DeliverableValidationService } from "./deliverable-validation.service";
import {
    CreateDeliverableRuleDto,
    UpdateDeliverableRuleDto,
    AssignRuleToPromotionProjectDto,
} from "./dto/deliverable-rule.dto";
import { JwtAuthGuard } from "src/auth/strategies/jwt/jwt-auth.guard";

@Controller("deliverable-rules")
@UseGuards(JwtAuthGuard)
export class DeliverableRulesController {
    constructor(
        private readonly deliverableRulesService: DeliverableRulesService,
        private readonly deliverableValidationService: DeliverableValidationService,
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

    @Post("assign")
    async assignRuleToPromotionProject(
        @Body() assignDto: AssignRuleToPromotionProjectDto,
    ): Promise<void> {
        return this.deliverableRulesService.assignRuleToPromotionProject(
            assignDto,
        );
    }

    @Delete("unassign/:deliverableRuleId/:promotionProjectId")
    async removeRuleFromPromotionProject(
        @Param("deliverableRuleId") deliverableRuleId: string,
        @Param("promotionProjectId") promotionProjectId: string,
    ): Promise<void> {
        return this.deliverableRulesService.removeRuleFromPromotionProject(
            deliverableRuleId,
            promotionProjectId,
        );
    }

    @Get("promotion-project/:promotionProjectId/rules")
    getPromotionProjectRules(
        @Param("promotionProjectId") promotionProjectId: string,
    ) {
        return this.deliverableRulesService.getPromotionProjectRules(
            promotionProjectId,
        );
    }

    @Post("validate/:deliverableId")
    async validateDeliverable(@Param("deliverableId") deliverableId: string) {
        return this.deliverableValidationService.validateDeliverable(
            deliverableId,
        );
    }

    @Post("validate")
    testRule(@Body() testRuleDto: CreateDeliverableRuleDto) {
        // Test a rule without saving it to database
        return {
            message: "Rule test functionality not yet implemented",
            rule: testRuleDto,
        };
    }
}
