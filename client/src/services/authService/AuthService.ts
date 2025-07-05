import { Teacher } from "@/types/Teacher";
import { Student } from "@/types/Student";
import { User } from "@/types/User";
import { Api } from "../api/Api";
import { LoginRequest, LoginResponse, RegisterRequest } from "@/types/Auth";

export type UserWithDetails = (Student | Teacher) & { user: User };

const AUTH_PATH = "auth";

export class AuthService {
  private api: Api;

  constructor({ api = new Api() }: { api?: Api } = {}) {
    this.api = api;
  }

  async register(data: RegisterRequest) {
    return this.api.request<Teacher>({
      path: `${AUTH_PATH}/register`,
      method: "POST",
      data,
    });
  }

  async login(data: LoginRequest) {
    return this.api.request<LoginResponse>({
      path: `${AUTH_PATH}/login`,
      method: "POST",
      data,
    });
  }

  googleRedirect(queryParams: string) {
    return this.api.request<LoginResponse>({
      path: `${AUTH_PATH}/google-redirect${queryParams}`,
    });
  }

  microsoftRedirect(queryParams: string) {
    return this.api.request<LoginResponse>({
      path: `${AUTH_PATH}/microsoft-redirect${queryParams}`,
    });
  }

  async getCurrentUser() {
    return this.api.request<UserWithDetails>({
      path: `${AUTH_PATH}/me`,
      method: "GET",
    });
  }
}
