import { Api } from "../api/Api";

const DELIVERABLE_RULES_PATH = "deliverable-rules";

export interface RuleMaxSizeFile {
  maxSize: number;
}

export interface RuleFilePresence {
  fileName: string;
}

export interface RuleFileContentMatch {
  fileName: string;
  match: string;
  matchType: "TEXT" | "REGEX";
}

export interface RuleFolderStructure {
  expectedStructure: {
    type: "folder" | "file";
    name: string;
    required: boolean;
    children?: Array<{
      type: "folder" | "file";
      name: string;
      required: boolean;
      children?: unknown[];
    }>;
  };
}

export interface DeliverableRule {
  id: string;
  ruleType:
    | "MAX_SIZE_FILE"
    | "FILE_PRESENCE"
    | "FILE_CONTENT_MATCH"
    | "FOLDER_STRUCTURE";
  createdAt: string;
  updatedAt: string;
  ruleMaxSizeFile?: RuleMaxSizeFile;
  ruleFilePresence?: RuleFilePresence;
  ruleFileContentMatch?: RuleFileContentMatch;
  ruleFolderStructure?: RuleFolderStructure;
}

export interface CreateDeliverableRuleRequest {
  ruleType:
    | "MAX_SIZE_FILE"
    | "FILE_PRESENCE"
    | "FILE_CONTENT_MATCH"
    | "FOLDER_STRUCTURE";
  ruleData:
    | RuleMaxSizeFile
    | RuleFilePresence
    | RuleFileContentMatch
    | RuleFolderStructure;
}

export interface UpdateDeliverableRuleRequest {
  ruleData?:
    | RuleMaxSizeFile
    | RuleFilePresence
    | RuleFileContentMatch
    | RuleFolderStructure;
}

export interface AssignRuleToPromotionProjectRequest {
  deliverableRuleId: string;
  promotionProjectId: string;
}

export class DeliverableRulesService {
  private api: Api;

  constructor({ api = new Api() }: { api?: Api } = {}) {
    this.api = api;
  }

  async create(data: CreateDeliverableRuleRequest): Promise<DeliverableRule> {
    return this.api.request<DeliverableRule>({
      path: DELIVERABLE_RULES_PATH,
      method: "POST",
      data,
    });
  }

  async findAll(): Promise<DeliverableRule[]> {
    return this.api.request<DeliverableRule[]>({
      path: DELIVERABLE_RULES_PATH,
      method: "GET",
    });
  }

  async findOne(id: string): Promise<DeliverableRule> {
    return this.api.request<DeliverableRule>({
      path: `${DELIVERABLE_RULES_PATH}/${id}`,
      method: "GET",
    });
  }

  async update(
    id: string,
    data: UpdateDeliverableRuleRequest,
  ): Promise<DeliverableRule> {
    return this.api.request<DeliverableRule>({
      path: `${DELIVERABLE_RULES_PATH}/${id}`,
      method: "PATCH",
      data,
    });
  }

  async delete(id: string): Promise<void> {
    return this.api.request<void>({
      path: `${DELIVERABLE_RULES_PATH}/${id}`,
      method: "DELETE",
    });
  }

  async assignToPromotionProject(
    data: AssignRuleToPromotionProjectRequest,
  ): Promise<void> {
    return this.api.request<void>({
      path: `${DELIVERABLE_RULES_PATH}/assign`,
      method: "POST",
      data,
    });
  }

  async removeFromPromotionProject(
    deliverableRuleId: string,
    promotionProjectId: string,
  ): Promise<void> {
    return this.api.request<void>({
      path: `${DELIVERABLE_RULES_PATH}/unassign/${deliverableRuleId}/${promotionProjectId}`,
      method: "DELETE",
    });
  }

  async getPromotionProjectRules(
    promotionProjectId: string,
  ): Promise<{ deliverableRule: DeliverableRule }[]> {
    return this.api.request({
      path: `${DELIVERABLE_RULES_PATH}/promotion-project/${promotionProjectId}/rules`,
      method: "GET",
    });
  }

  async validateDeliverable(deliverableId: string): Promise<{
    valid: boolean;
    rules: Array<{
      ruleId: string;
      ruleType: string;
      respected: boolean;
      message: string | null;
    }>;
  }> {
    return this.api.request({
      path: `${DELIVERABLE_RULES_PATH}/validate/${deliverableId}`,
      method: "POST",
    });
  }

  async testRule(data: CreateDeliverableRuleRequest): Promise<{
    valid: boolean;
    message: string;
  }> {
    return this.api.request({
      path: `${DELIVERABLE_RULES_PATH}/validate`,
      method: "POST",
      data,
    });
  }
}
