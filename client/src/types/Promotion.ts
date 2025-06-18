import { Project, ProjectGroupRule } from "./Project";
import { Student } from "./Student";
import { Teacher } from "./Teacher";

export type PromotionRequest = {
  name: string;
  startDate: Date;
  endDate: Date;
};

export type PromotionStudentRequest = {
  email: string;
  firstName: string;
  lastName: string;
  promotionId: string;
};

export type PromotionStudent = {
  student?: Student;
  studentId: string;
  teacher?: Teacher;
  teacherId: string;
  createdAt: Date;
};

export type Promotion = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  createdByTeacherId: string;
  teacher?: Teacher;
  promotionStudents?: PromotionStudent[];
};

export type PromotionProject = {
  id: string;
  minPerGroup: number;
  maxPerGroup: number;
  malus: number;
  malusPerTime: number;
  allowLateSubmission: boolean;
  projectGroupRule: ProjectGroupRule;
  createdAt: Date;
  updatedAt: Date;
  promotion: Promotion;
  project: Project;
};
