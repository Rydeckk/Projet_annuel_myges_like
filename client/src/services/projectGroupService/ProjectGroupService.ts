import {
  ProjectGroupRequest,
  ProjectGroup,
  UpdateProjectGroupRequest,
} from "@/types/ProjectGroup";
import { Api } from "../api/Api";

const PROJECT_GROUP_PATH = "project-groups";

export class ProjectGroupService {
  private api: Api;

  constructor({ api = new Api() }: { api?: Api } = {}) {
    this.api = api;
  }

  async create(data: ProjectGroupRequest) {
    return this.api.request<ProjectGroup>({
      path: PROJECT_GROUP_PATH,
      method: "POST",
      data,
    });
  }

  async update(
    projectGroupId: string,
    data: Partial<UpdateProjectGroupRequest>,
  ) {
    return this.api.request<ProjectGroup>({
      path: `${PROJECT_GROUP_PATH}/${projectGroupId}`,
      method: "PUT",
      data,
    });
  }

  async delete(projectGroupId: string) {
    return this.api.request<ProjectGroup>({
      path: `${PROJECT_GROUP_PATH}/${projectGroupId}`,
      method: "DELETE",
    });
  }
}
