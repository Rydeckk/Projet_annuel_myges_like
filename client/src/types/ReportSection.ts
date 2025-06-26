export type ReportSection = {
  id: string;
  title: string;
  description: string;
  order: number;
  promotionProjectId: string;
  teacherId: string;
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
