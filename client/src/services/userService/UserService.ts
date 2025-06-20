import { User } from "@/types/User";
import { Api } from "../api/Api";
import { PromotionStudentRequest } from "@/types/Promotion";

const USER_ROUTE = "users";

export class UserService {
  private api: Api;

  constructor({ api = new Api() }: { api?: Api } = {}) {
    this.api = api;
  }

  async update(
    userId: string,
    data: Omit<PromotionStudentRequest, "promotionId">,
  ) {
    return this.api.request<User>({
      path: `${USER_ROUTE}/${userId}`,
      method: "PUT",
      data,
    });
  }

  async delete(userId: string) {
    return this.api.request<User>({
      path: `${USER_ROUTE}/${userId}`,
      method: "DELETE",
    });
  }
}
