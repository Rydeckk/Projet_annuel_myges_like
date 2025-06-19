import { Project, ProjectRequest } from "@/types/Project";
import { Api } from "../api/Api";

const PROJECT_PATH = "projects";

export class ProjectService {
  private api: Api;

  constructor({ api = new Api() }: { api?: Api } = {}) {
    this.api = api;
  }

  async getTeacherProjects() {
    return this.api.request<Project[]>({
      path: `${PROJECT_PATH}/me`,
    });
  }

  async create(data: ProjectRequest | FormData) {
    return this.api.request<Project>({
      path: PROJECT_PATH,
      method: "POST",
      data,
      ...(data instanceof FormData ? { contentType: null } : {}),
    });
  }

  async update(projectId: string, data: Partial<ProjectRequest>) {
    return this.api.request<Project>({
      path: `${PROJECT_PATH}/${projectId}`,
      method: "PUT",
      data,
    });
  }

  async delete(projectId: string) {
    return this.api.request<Project>({
      path: `${PROJECT_PATH}/${projectId}`,
      method: "DELETE",
    });
  }
}
