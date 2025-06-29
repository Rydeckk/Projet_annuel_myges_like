import { Student } from "./Student";

export type CreateProjectGroupStudent = {
  projectGroupId: string;
  studentId: string;
  promotionProjectId: string;
};

export type DeleteProjectGroupStudent = {
  projectGroupId: string;
  studentId: string;
};

export type ProjectGroupStudent = {
  studentId: string;
  projectGroupId: string;
  createdAt: Date;
  student?: Student;
};
