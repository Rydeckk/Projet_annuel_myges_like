import { PromotionProject } from "./PromotionProject";
import { Report } from "./Report";

export type ReportSection = {
  id: string;
  title: string;
  description: string;
  order: number;
  promotionProjectId: string;
  promotionProject: PromotionProject;
  teacherId: string;
  reports: Report[];
};

export type ReportSectionRequest = {
  title: string;
  description?: string;
  promotionProjectId: string;
};

export type ReportSectionUpdateRequest = {
  title?: string;
  description?: string;
  order?: number;
};
