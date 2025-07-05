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

  async create(data: ProjectRequest) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    return this.api.request<Project>({
      path: PROJECT_PATH,
      method: "POST",
      data: formData,
      contentType: null,
    });
  }

  async update(projectId: string, data: Partial<ProjectRequest>) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    return this.api.request<Project>({
      path: `${PROJECT_PATH}/${projectId}`,
      method: "PUT",
      data: formData,
      contentType: null,
    });
  }

  async delete(projectId: string) {
    return this.api.request<Project>({
      path: `${PROJECT_PATH}/${projectId}`,
      method: "DELETE",
    });
  }
}
