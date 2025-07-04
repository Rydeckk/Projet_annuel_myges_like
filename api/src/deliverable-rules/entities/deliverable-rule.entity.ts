import { RuleType, MatchType } from "@prisma/client";

export class DeliverableRuleEntity {
    id: string;
    ruleType: RuleType;
    createdAt: Date;
    updatedAt: Date;

    // Related rule data (only one will be populated based on ruleType)
    ruleMaxSizeFile?: RuleMaxSizeFileEntity;
    ruleFilePresence?: RuleFilePresenceEntity;
    ruleFileContentMatch?: RuleFileContentMatchEntity;
    ruleFolderStructure?: RuleFolderStructureEntity;

    // Related promotion projects
    promotionProjectDeliverableRules?: PromotionProjectDeliverableRuleEntity[];

    constructor(partial: Partial<DeliverableRuleEntity>) {
        Object.assign(this, partial);
    }
}

export class RuleMaxSizeFileEntity {
    id: string;
    maxSize: number;
    deliverableRuleId: string;

    constructor(partial: Partial<RuleMaxSizeFileEntity>) {
        Object.assign(this, partial);
    }
}

export class RuleFilePresenceEntity {
    id: string;
    fileName: string;
    deliverableRuleId: string;

    constructor(partial: Partial<RuleFilePresenceEntity>) {
        Object.assign(this, partial);
    }
}

export class RuleFileContentMatchEntity {
    id: string;
    fileName: string;
    match: string;
    matchType: MatchType;
    deliverableRuleId: string;

    constructor(partial: Partial<RuleFileContentMatchEntity>) {
        Object.assign(this, partial);
    }
}

export class RuleFolderStructureEntity {
    id: string;
    expectedStructure: string; // JSON string
    deliverableRuleId: string;

    constructor(partial: Partial<RuleFolderStructureEntity>) {
        Object.assign(this, partial);
    }
}

export class PromotionProjectDeliverableRuleEntity {
    promotionProjectId: string;
    deliverableRuleId: string;
    createdAt: Date;

    constructor(partial: Partial<PromotionProjectDeliverableRuleEntity>) {
        Object.assign(this, partial);
    }
}

export class ValidationResultEntity {
    isValid: boolean;
    ruleId: string;
    ruleType: string;
    message: string;
    details?: any;

    constructor(partial: Partial<ValidationResultEntity>) {
        Object.assign(this, partial);
    }
}

export class DeliverableValidationResultEntity {
    isValid: boolean;
    results: ValidationResultEntity[];
    summary: {
        totalRules: number;
        passedRules: number;
        failedRules: number;
    };

    constructor(partial: Partial<DeliverableValidationResultEntity>) {
        Object.assign(this, partial);
    }
}
