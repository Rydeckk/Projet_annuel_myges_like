import { Api } from "../api/Api";
import {
    ReportSection,
    ReportSectionRequest,
    ReportSectionUpdateRequest,
} from "@/types/ReportSection";

const REPORT_SECTIONS_PATH = "report-sections";

export class ReportSectionsService {
    private api: Api;

    constructor({ api = new Api() }: { api?: Api } = {}) {
        this.api = api;
    }

    async create(data: ReportSectionRequest) {
        return this.api.request<ReportSection>({
            path: REPORT_SECTIONS_PATH,
            method: "POST",
            data,
        });
    }

    async update(reportSectionId: string, data: ReportSectionUpdateRequest) {
        return this.api.request<ReportSection>({
            path: `${REPORT_SECTIONS_PATH}/${reportSectionId}`,
            method: "PATCH",
            data,
        });
    }

    async delete(reportSectionId: string, promotionProjectId: string) {
        return this.api.request<ReportSection>({
            path: `${REPORT_SECTIONS_PATH}/${reportSectionId}`,
            method: "DELETE",
            data: {
                promotionProjectId,
            },
        });
    }
}
