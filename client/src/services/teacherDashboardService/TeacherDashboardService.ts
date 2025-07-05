import { Api } from "../api/Api";

const TEACHER_PATH = "teacher";

export interface ProjectOverview {
  project: {
    id: string;
    name: string;
    description: string;
  };
  totalGroups: number;
  submittedGroups: number;
  pendingGroups: number;
  complianceRate: number;
  averageSimilarity: number;
}

export interface SubmissionStatus {
  groupId: string;
  groupName: string;
  students: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  deliverables: Array<{
    id: string;
    name: string;
    submitted: boolean;
    submittedAt: Date | null;
    isLate: boolean;
  }>;
}

export interface ComplianceStatus {
  groupId: string;
  groupName: string;
  totalRules: number;
  passedRules: number;
  failedRules: number;
  complianceRate: number;
  ruleDetails: Array<{
    ruleId: string;
    ruleType: string;
    passed: boolean;
  }>;
}

export interface SimilarityResult {
  group1Id: string;
  group1Name: string;
  group2Id: string;
  group2Name: string;
  similarityRate: number;
  deliverable1Id: string;
  deliverable2Id: string;
}

export class TeacherDashboardService {
  private api: Api;

  constructor({ api = new Api() }: { api?: Api } = {}) {
    this.api = api;
  }

  async getProjectOverview(
    promotionProjectId: string,
  ): Promise<ProjectOverview> {
    return this.api.request<ProjectOverview>({
      path: `${TEACHER_PATH}/projects/${promotionProjectId}/overview`,
      method: "GET",
    });
  }

  async getProjectSubmissions(
    promotionProjectId: string,
  ): Promise<SubmissionStatus[]> {
    return this.api.request<SubmissionStatus[]>({
      path: `${TEACHER_PATH}/projects/${promotionProjectId}/submissions`,
      method: "GET",
    });
  }

  async getProjectCompliance(
    promotionProjectId: string,
  ): Promise<ComplianceStatus[]> {
    return this.api.request<ComplianceStatus[]>({
      path: `${TEACHER_PATH}/projects/${promotionProjectId}/compliance`,
      method: "GET",
    });
  }

  async getProjectSimilarity(
    promotionProjectId: string,
  ): Promise<SimilarityResult[]> {
    return this.api.request<SimilarityResult[]>({
      path: `${TEACHER_PATH}/projects/${promotionProjectId}/similarity`,
      method: "GET",
    });
  }
}
