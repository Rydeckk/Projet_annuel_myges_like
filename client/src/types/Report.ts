import { ProjectGroup } from "./ProjectGroup";
import { ReportSection } from "./ReportSection";
import { Student } from "./Student";

export type ReportRequest = {
  content: string;
  projectGroupId: string;
  reportSectionId: string;
};

export type ReportUpdateRequest = {
  content?: string;
};

export type Report = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  projectGroupId: string;
  projectGroup: ProjectGroup;
  createdByStudentId: string;
  createdBystudent?: Student;
  reportSectionId: string;
  reportSection: ReportSection;
};

export type ReportContent = {
  content: string;
};
