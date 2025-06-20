import { ProjectGroup } from "./ProjectGroup";
import { Student } from "./Student";

export type ProjectGroupStudent = {
  projectGroupId: string;
  projectGroup?: ProjectGroup;
  studentId: string;
  student?: Student;
  createdAt: Date;
};
