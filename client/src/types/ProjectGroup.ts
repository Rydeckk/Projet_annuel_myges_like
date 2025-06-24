import { ProjectGroupStudent } from "./ProjectGroupStudent";

export type CreateProjectGroupDto = {
  name: string;
  promotionProjectId: string;
};

export type UpdateProjectGroupDto = Omit<
  CreateProjectGroupDto,
  "promotionProjectId"
>;

export type ProjectGroup = {
  id: string;
  name: string;
  promotionProjectId: string;
  createdAt: Date;
  updatedAt: Date;
  projectGroupStudents?: ProjectGroupStudent[];
};
