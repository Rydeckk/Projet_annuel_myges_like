import { Student } from "./Student";

export type ProjectGroupStudent = {
  studentId: string;
  projectGroupId: string;
  createdAt: Date;
  student?: Student;
};
