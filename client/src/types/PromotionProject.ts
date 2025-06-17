import { ProjectGroupRule } from "@/enums/ProjectGroupRule";

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
};
