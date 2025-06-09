import { ObjectValues } from "@/utils/objectValues";

export const PROJECT_VISIBILITY = {
  DRAFT: "DRAFT",
  VISIBLE: "VISIBLE",
} as const;

export type ProjectVisibility = ObjectValues<typeof PROJECT_VISIBILITY>;
