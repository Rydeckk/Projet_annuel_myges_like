import {
  Report,
  ReportContent,
  ReportRequest,
  ReportUpdateRequest,
} from "@/types/Report";
import { Api } from "../api/Api";

const REPORT_PATH = "report";

export class ReportService {
  private api: Api;

  constructor({ api = new Api() }: { api?: Api } = {}) {
    this.api = api;
  }

  async create(data: ReportRequest) {
    return this.api.request<Report>({
      path: REPORT_PATH,
      method: "POST",
      data,
    });
  }

  async getReportByProjectGroupId(projectGroupId: string) {
    return this.api.request<Report>({
      path: `${REPORT_PATH}/project-group/${projectGroupId}`,
      method: "GET",
    });
  }

  async getReportsByPromotionId(promotionId: string) {
    return this.api.request<Report[]>({
      path: `${REPORT_PATH}/promotion/${promotionId}`,
      method: "GET",
    });
  }

  async getReportContentByPromotionAndProjectAndGroup(
    promotionId: string,
    projectName: string,
    projectGroupName: string,
    reportSectionName: string | null,
  ) {
    const query = reportSectionName
      ? `?reportSectionName=${reportSectionName}`
      : "";
    return this.api.request<ReportContent>({
      path: `${REPORT_PATH}/promotion/${promotionId}/project/${projectName}/project-group/${projectGroupName}/content${query}`,
      method: "GET",
    });
  }

  async update(reportId: string, data: Partial<ReportUpdateRequest>) {
    return this.api.request<Report>({
      path: `${REPORT_PATH}/${reportId}`,
      method: "PATCH",
      data,
    });
  }

  async delete(reportId: string) {
    return this.api.request<Report>({
      path: `${REPORT_PATH}/${reportId}`,
      method: "DELETE",
    });
  }
}
