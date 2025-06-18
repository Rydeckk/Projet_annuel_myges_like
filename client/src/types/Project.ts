import { ProjectVisibility } from "@/enums/ProjectVisibility";
import { PromotionProject } from "./Promotion";

export type ProjectRequest = {
  name: string;
  description: string;
  projectVisibility: ProjectVisibility;
  fileName?: string;
  fileSize?: number;
  path?: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  fileName: string | null;
  path: string | null;
  fileSize: number | null;
  projectVisibility: ProjectVisibility;
  createdAt: Date;
  updatedAt: Date;
  createdByTeacherId: string;
};

export type ProjectGroup = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  promotionProject: PromotionProject;
};

export type ProjectGroupRule = {
  id: string;
  name: string;
};
