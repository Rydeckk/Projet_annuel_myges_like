import { Project, ProjectGroupRule } from "./Project";
import { Teacher } from "./Teacher";
import { PromotionStudent } from "./PromotionStudent";

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
  promotionProjects?: PromotionProject[];
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
