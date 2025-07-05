import { PromotionProject } from "./PromotionProject";
import { Report } from "./Report";

export type ReportSection = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string;
  order: number;
  promotionProjectId: string;
  teacherId: string;
  reports?: Report[];
  promotionProject?: PromotionProject;
};

export type ReportSectionRequest = {
  title: string;
  description?: string;
  promotionProjectId: string;
};

export type ReportSectionUpdateRequest = Partial<{
  title: string;
  description: string;
  order: number;
}> & { promotionProjectId: string };
