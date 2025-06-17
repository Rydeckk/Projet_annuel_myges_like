import { ObjectValues } from "@/utils/objectValues";

export const PROJECT_GROUP_RULE = {
  MANUAL: "MANUAL",
  RANDOM: "RANDOM",
  FREE: "FREE",
} as const;

export type ProjectGroupRule = ObjectValues<typeof PROJECT_GROUP_RULE>;
