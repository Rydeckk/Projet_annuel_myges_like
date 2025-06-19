import { ProjectVisibility } from "@/enums/ProjectVisibility";

export type ProjectRequest = {
  name: string;
  description: string;
  projectVisibility: ProjectVisibility;
  file: File;
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
