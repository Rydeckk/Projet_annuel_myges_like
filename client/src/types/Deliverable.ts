import { Student } from "./Student";
import { ProjectGroup } from "./ProjectGroup";

export type Deliverable = {
  id: string;
  name: string;
  description?: string;
  type: "ARCHIVE" | "GIT_REPO";
  deadline?: Date;
  submitAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  projectGroupId: string;
  projectGroup?: ProjectGroup;
  uploadedByStudentId: string;
  uploadedByStudent?: Student;
  deliverableArchive?: DeliverableArchive;
  deliverableGitRepo?: DeliverableGitRepo;
  isLateSubmission?: boolean;
  lateMalus?: number;
  submissionComment?: string;
};

export type DeliverableArchive = {
  id: string;
  name: string;
  path: string;
  fileSize: number;
  createdAt: Date;
  updatedAt: Date;
  deliverableId: string;
};

export type CreateDeliverableRequest = {
  name: string;
  description?: string;
  projectGroupId: string;
};

export type UpdateDeliverableRequest = {
  name?: string;
  description?: string;
};

export type DeliverableGitRepo = {
  id: string;
  repositoryUrl: string;
  branch?: string;
  commitHash?: string;
  createdAt: Date;
  updatedAt: Date;
  deliverableId: string;
};

export type UploadDeliverableResponse = {
  url: string;
  filename: string;
  size: number;
};
