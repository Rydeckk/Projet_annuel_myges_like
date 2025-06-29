import { ProjectGroupStudent } from "./ProjectGroupStudent";

export type ProjectGroup = {
  id: string;
  name: string;
  promotionProjectId: string;
  createdAt: Date;
  updatedAt: Date;
  projectGroupStudents?: ProjectGroupStudent[];
  report?: Report[];
};
