import { ProjectGroupRule } from "@/enums/ProjectGroupRule";
import { Project } from "./Project";
import { ProjectGroup } from "./ProjectGroup";
import { MalusTimeType } from "@/enums/MalusTimeType";

export type PromotionProjectRequest = {
  minPerGroup: number;
  maxPerGroup: number;
  allowLateSubmission: boolean;
  isReportRequired: boolean;
  startDate: Date;
  endDate: Date;
  projectGroupRule: ProjectGroupRule;
  projectId: string;
  promotionId: string;
};

export type UpdatePromotionProjectRequest = Partial<
  Omit<PromotionProjectRequest, "projectId" | "promotionId">
>;

export type PromotionProject = {
  id: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  minPerGroup: number;
  maxPerGroup: number;
  malus: number | null;
  malusTimeType: MalusTimeType | null;
  allowLateSubmission: boolean;
  isReportRequired: boolean;
  projectGroupRule: ProjectGroupRule;
  startDate: Date;
  endDate: Date;
  promotionId: string;
  projectId: string;
  project?: Project;
  projectGroups?: ProjectGroup[];
};
