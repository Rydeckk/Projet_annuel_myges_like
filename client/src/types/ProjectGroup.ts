import { ProjectGroupStudent } from "./ProjectGroupStudent";

export type ProjectGroupRequest = {
  name: string;
  promotionProjectId: string;
};

export type UpdateProjectGroupRequest = Partial<{
  name: string;
  selectedProjectGroupStudentIds: string[];
}>;

export type ProjectGroup = {
  id: string;
  name: string;
  promotionProjectId: string;
  createdAt: Date;
  updatedAt: Date;
  projectGroupStudents?: ProjectGroupStudent[];
  report?: Report[];
};
