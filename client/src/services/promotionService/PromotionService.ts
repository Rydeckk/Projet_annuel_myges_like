import {
  Promotion,
  PromotionRequest,
  PromotionStudentRequest,
} from "@/types/Promotion";
import { Api } from "../api/Api";
import { Student } from "@/types/Student";

const PROMOTION_PATH = "promotions";

export class PromotionService {
  api: Api;

  constructor({ api = new Api() }: { api?: Api } = {}) {
    this.api = api;
  }

  async findAll(name: string = "") {
    const queryParams = name ? `?name=${name}` : "";
    return this.api.request<Promotion | Promotion[]>({
      path: `${PROMOTION_PATH}${queryParams}`,
    });
  }

  async create(data: PromotionRequest) {
    return this.api.request<Promotion>({
      path: PROMOTION_PATH,
      method: "POST",
      data,
    });
  }

  async createPromotionStudents(data: PromotionStudentRequest[]) {
    return this.api.request<Student>({
      path: `${PROMOTION_PATH}/students`,
      method: "POST",
      data,
    });
  }

  async update({
    promotionId,
    data,
  }: {
    promotionId: string;
    data: Partial<PromotionRequest>;
  }) {
    return this.api.request<Promotion>({
      path: `${PROMOTION_PATH}/${promotionId}`,
      method: "PUT",
      data,
    });
  }

  async delete(promotionId: string) {
    return this.api.request<Promotion>({
      path: `${PROMOTION_PATH}/${promotionId}`,
      method: "DELETE",
    });
  }
}
