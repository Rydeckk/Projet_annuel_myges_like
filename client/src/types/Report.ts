import { ProjectGroup } from "./Project";

export type ReportRequest = {
  content: string;
  projectGroupId: string;
};

export type Report = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  projetGroup: ProjectGroup;
};
