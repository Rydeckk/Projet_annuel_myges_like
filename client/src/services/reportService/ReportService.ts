import { Report, ReportRequest } from "@/types/Report";
import { Api } from "../api/Api";

const REPORT_PATH = "report";

export class ReportService {
  api: Api;

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
    return this.api.request<Report[]>({
      path: `${REPORT_PATH}/project-group/${projectGroupId}`,
      method: "GET",
    });
  }

  async update(reportId: string, data: Partial<ReportRequest>) {
    return this.api.request<Report>({
      path: `${REPORT_PATH}/${reportId}`,
      method: "PUT",
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
