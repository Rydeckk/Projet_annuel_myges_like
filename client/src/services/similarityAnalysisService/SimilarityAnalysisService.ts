import { Api } from "../api/Api";

const SIMILARITY_PATH = "similarity";

export interface ProjectSimilarityResults {
  promotionProjectId: string;
  analysisDate: Date;
  results: Array<{
    deliverable1Id: string;
    deliverable2Id: string;
    similarityScore: number;
    matchDetails: Array<{
      file1: string;
      file2: string;
      similarity: number;
    }>;
  }>;
  summary: {
    totalComparisons: number;
    highSimilarityCount: number;
    averageSimilarity: number;
  };
}

export interface AnalyzeProjectRequest {
  promotionProjectId: string;
}

export class SimilarityAnalysisService {
  private api: Api;

  constructor({ api = new Api() }: { api?: Api } = {}) {
    this.api = api;
  }

  async analyzeProject(
    promotionProjectId: string,
  ): Promise<ProjectSimilarityResults> {
    return this.api.request<ProjectSimilarityResults>({
      path: `${SIMILARITY_PATH}/analyze`,
      method: "POST",
      data: {
        promotionProjectId,
      },
    });
  }

  async getProjectAnalysis(
    promotionProjectId: string,
  ): Promise<ProjectSimilarityResults> {
    return this.api.request({
      path: `${SIMILARITY_PATH}/project/${promotionProjectId}`,
      method: "GET",
    });
  }

  async getDeliverableResults(deliverableId: string): Promise<
    Array<{
      deliverableId: string;
      deliverableName: string;
      groupName: string;
      similarityScore: number;
      matchDetails: Array<{
        file1: string;
        file2: string;
        similarity: number;
      }>;
    }>
  > {
    return this.api.request({
      path: `${SIMILARITY_PATH}/deliverable/${deliverableId}`,
      method: "GET",
    });
  }
}
