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
  createdByStudentId: string;
  reportSectionId: string;
};
