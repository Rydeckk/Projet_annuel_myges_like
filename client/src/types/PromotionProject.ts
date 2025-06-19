import { ProjectGroupRule } from "@/enums/ProjectGroupRule";
import { Project } from "./Project";

export type PromotionProjectRequest = {
  minPerGroup: number;
  maxPerGroup: number;
  allowLateSubmission: boolean;
  projectGroupRule: ProjectGroupRule;
  projectId: string;
  promotionId: string;
};

export type PromotionProject = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  promotionId: string;
  minPerGroup: number;
  maxPerGroup: number;
  malus: number | null;
  malusPerTime: Date | null;
  allowLateSubmission: boolean;
  projectGroupRule: ProjectGroupRule;
  projectId: string;
  project?: Project;
};
