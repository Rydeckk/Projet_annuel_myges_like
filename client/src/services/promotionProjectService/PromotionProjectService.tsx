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

    async create(data: PromotionProjectRequest): Promise<PromotionProject> {
        return this.api.request({
            path: PROMOTION_PROJECTS_PATH,
            method: "POST",
            data,
        });
    }

    async findStudentProjects(): Promise<PromotionProject[]> {
        return this.api.request({
            path: `${PROMOTION_PROJECTS_PATH}/student`,
            method: "GET",
        });
    }

    async findByProjectName(
        projectName: string,
    ): Promise<PromotionProject | null> {
        return this.api.request({
            path: `${PROMOTION_PROJECTS_PATH}/project/${projectName}`,
            method: "GET",
        });
    }
}
