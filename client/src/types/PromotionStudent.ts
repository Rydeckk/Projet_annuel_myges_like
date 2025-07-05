import { Student } from "./Student";
import { Teacher } from "./Teacher";

export type PromotionStudent = {
  student?: Student;
  studentId: string;
  teacher?: Teacher;
  teacherId: string;
  createdAt: Date;
};
