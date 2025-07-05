import {
    PromotionProject,
    PromotionProjectRequest,
    UpdatePromotionProjectRequest,
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

    async update(id: string, data: UpdatePromotionProjectRequest) {
        return this.api.request<PromotionProject>({
            path: `${PROMOTION_PROJECTS_PATH}/${id}`,
            method: "PUT",
            data,
        });
    }

    async findCurrentStudentPromotionProjects() {
        return this.api.request<PromotionProject[]>({
            path: `${PROMOTION_PROJECTS_PATH}/current-student`,
            method: "GET",
        });
    }

    async teacherFindByProjectName(projectName: string) {
        return this.api.request<PromotionProject>({
            path: `${PROMOTION_PROJECTS_PATH}/teacher/project/${projectName}`,
            method: "GET",
        });
    }

    async studentFindByProjectName(projectName: string) {
        return this.api.request<PromotionProject>({
            path: `${PROMOTION_PROJECTS_PATH}/student/project/${projectName}`,
            method: "GET",
        });
    }

    async delete(id: string) {
        return this.api.request<PromotionProject>({
            path: `${PROMOTION_PROJECTS_PATH}/${id}`,
            method: "DELETE",
        });
    }
}
