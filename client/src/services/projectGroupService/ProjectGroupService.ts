import { Api } from "../api/Api";
import {
  CreateAllProjectGroupRequest,
  CreateProjectGroupRequest,
  ProjectGroup,
} from "@/types/ProjectGroup";

const PROJECT_GROUP_PATH = "project-groups";

export class ProjectGroupService {
  private api: Api;

  constructor({ api = new Api() }: { api?: Api } = {}) {
    this.api = api;
  }

  async create(data: CreateProjectGroupRequest) {
    return this.api.request<ProjectGroup>({
      path: PROJECT_GROUP_PATH,
      method: "POST",
      data,
    });
  }

  async createAllProjectGroups(data: CreateAllProjectGroupRequest) {
    return this.api.request<ProjectGroup[]>({
      path: `${PROJECT_GROUP_PATH}/all`,
      method: "POST",
      data,
    });
  }

  async getProjectGroups(promotionProjectId: string): Promise<ProjectGroup[]> {
    return this.api.request<ProjectGroup[]>({
      path: `${PROJECT_GROUP_PATH}/promotion-project/${promotionProjectId}`,
      method: "GET",
    });
  }

  async getMyProjectGroup(
    promotionProjectId: string,
  ): Promise<ProjectGroup | null> {
    return this.api.request<ProjectGroup | null>({
      path: `${PROJECT_GROUP_PATH}/promotion-project/${promotionProjectId}/me`,
      method: "GET",
    });
  }
}
