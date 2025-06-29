import { ObjectValues } from "@/utils/objectValues";

export const PROJECT_VISIBILITY = {
  DRAFT: "DRAFT",
  VISIBLE: "VISIBLE",
} as const;

export type ProjectVisibility = ObjectValues<typeof PROJECT_VISIBILITY>;

export const GET_COLOR_STYLES_BY_VISIBILITY = {
  [PROJECT_VISIBILITY.DRAFT]: "bg-orange-100 text-orange-600",
  [PROJECT_VISIBILITY.VISIBLE]: "bg-green-100 text-green-600",
};
