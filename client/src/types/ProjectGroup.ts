import { ProjectGroupStudent } from "./ProjectGroupStudent";

export type CreateProjectGroupRequest = {
  name: string;
  promotionProjectId: string;
};

export type CreateAllProjectGroupRequest = {
  promotionProjectId: string;
};

export type CreateProjectGroupStudentRequest = {
  projectGroupId: string;
  studentId: string;
};

export type ProjectGroup = {
  id: string;
  name: string;
  promotionProjectId: string;
  createdAt: Date;
  updatedAt: Date;
  projectGroupStudents?: ProjectGroupStudent[];
};
