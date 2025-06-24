import {
  CreateProjectGroupDto,
  ProjectGroup,
  UpdateProjectGroupDto,
} from "@/types/ProjectGroup";
import { Api } from "../api/Api";

const PROJECT_GROUP_PATH = "project-groups";

export class ProjectGroupService {
  private api: Api;

  constructor({ api = new Api() }: { api?: Api } = {}) {
    this.api = api;
  }

  async create(data: CreateProjectGroupDto) {
    return this.api.request<ProjectGroup>({
      path: PROJECT_GROUP_PATH,
      method: "POST",
      data,
    });
  }

  async update(projectId: string, data: UpdateProjectGroupDto) {
    return this.api.request<ProjectGroup>({
      path: `${PROJECT_GROUP_PATH}/${projectId}`,
      method: "PUT",
      data,
    });
  }

  async delete(projectId: string) {
    return this.api.request<ProjectGroup>({
      path: `${PROJECT_GROUP_PATH}/${projectId}`,
      method: "DELETE",
    });
  }
}
