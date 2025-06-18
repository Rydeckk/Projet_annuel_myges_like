import { PromotionProjectRequest } from "@/types/PromotionProject";
import { Api } from "../api/Api";

const PROMOTION_PROJECTS_PATH = "promotion-projects";

export class PromotionProjectService {
    private api: Api;

    constructor({ api = new Api() }: { api?: Api } = {}) {
        this.api = api;
    }

    async create(data: PromotionProjectRequest) {
        return this.api.request({
            path: PROMOTION_PROJECTS_PATH,
            method: "POST",
            data,
        });
    }
}
