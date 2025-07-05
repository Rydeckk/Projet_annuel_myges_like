import { Api } from "../api/Api";
import {
  Deliverable,
  CreateDeliverableRequest,
  UpdateDeliverableRequest,
  UploadDeliverableResponse,
} from "@/types/Deliverable";

const DELIVERABLES_PATH = "deliverables";

export class DeliverableService {
  private api: Api;

  constructor({ api = new Api() }: { api?: Api } = {}) {
    this.api = api;
  }

  async create(data: CreateDeliverableRequest): Promise<Deliverable> {
    return this.api.request<Deliverable>({
      path: DELIVERABLES_PATH,
      method: "POST",
      data,
    });
  }

  async findByProjectGroup(projectGroupId: string): Promise<Deliverable[]> {
    return this.api.request<Deliverable[]>({
      path: `${DELIVERABLES_PATH}/project-group/${projectGroupId}`,
      method: "GET",
    });
  }

  async findOne(id: string): Promise<Deliverable> {
    return this.api.request<Deliverable>({
      path: `${DELIVERABLES_PATH}/${id}`,
      method: "GET",
    });
  }

  async update(
    id: string,
    data: UpdateDeliverableRequest,
  ): Promise<Deliverable> {
    return this.api.request<Deliverable>({
      path: `${DELIVERABLES_PATH}/${id}`,
      method: "PATCH",
      data,
    });
  }

  async delete(id: string): Promise<void> {
    return this.api.request<void>({
      path: `${DELIVERABLES_PATH}/${id}`,
      method: "DELETE",
    });
  }

  async attachFile(
    id: string,
    fileUrl: string,
    fileName: string,
    fileSize?: number,
  ): Promise<UploadDeliverableResponse> {
    return this.api.request<UploadDeliverableResponse>({
      path: `${DELIVERABLES_PATH}/${id}/attach-file`,
      method: "POST",
      data: {
        fileUrl,
        fileName,
        fileSize,
      },
    });
  }

  async downloadArchive(id: string): Promise<UploadDeliverableResponse> {
    return this.api.request<UploadDeliverableResponse>({
      path: `${DELIVERABLES_PATH}/${id}/download`,
      method: "GET",
    });
  }

  async attachGit(id: string, gitUrl: string, branch?: string): Promise<Deliverable> {
    return this.api.request<Deliverable>({
      path: `${DELIVERABLES_PATH}/${id}/attach-git`,
      method: "POST",
      data: {
        gitUrl,
        branch,
      },
    });
  }

  async submit(id: string, comment?: string, submitLate?: boolean): Promise<Deliverable> {
    return this.api.request<Deliverable>({
      path: `${DELIVERABLES_PATH}/${id}/submit`,
      method: "POST",
      data: {
        comment,
        submitLate,
      },
    });
  }

  async checkCompliance(id: string): Promise<{
    compliant: boolean;
    totalRules: number;
    passedRules: number;
    failedRules: number;
    rules: Array<{
      ruleId: string;
      ruleType: string;
      respected: boolean;
      message: string | null;
    }>;
  }> {
    return this.api.request({
      path: `${DELIVERABLES_PATH}/${id}/compliance`,
      method: "GET",
    });
  }

  async validateAgainstRules(id: string): Promise<any> {
    return this.api.request({
      path: `${DELIVERABLES_PATH}/${id}/validate`,
      method: "POST",
    });
  }

  async getValidationResults(id: string): Promise<any> {
    return this.api.request({
      path: `${DELIVERABLES_PATH}/${id}/validation-results`,
      method: "GET",
    });
  }
}
