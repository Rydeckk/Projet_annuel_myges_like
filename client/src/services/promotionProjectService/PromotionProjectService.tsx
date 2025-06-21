import {
    PromotionProject,
    PromotionProjectRequest,
} from "@/types/PromotionProject";
import { Api } from "../api/Api";

const PROMOTION_PROJECTS_PATH = "promotion-projects";

export class PromotionProjectService {
    private api: Api;

    constructor({ api = new Api() }: { api?: Api } = {}) {
        this.api = api;
    }

    async create(data: PromotionProjectRequest) {
        return this.api.request<PromotionProject>({
            path: PROMOTION_PROJECTS_PATH,
            method: "POST",
            data,
        });
    }

    async findCurrentStudentPromotionProjects() {
        return this.api.request<PromotionProject[]>({
            path: `${PROMOTION_PROJECTS_PATH}/current-student`,
            method: "GET",
        });
    }

    async findByProjectName(projectName: string) {
        return this.api.request<PromotionProject>({
            path: `${PROMOTION_PROJECTS_PATH}/project/${projectName}`,
            method: "GET",
        });
    }
}
