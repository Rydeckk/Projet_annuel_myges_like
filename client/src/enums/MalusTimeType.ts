import { ObjectValues } from "@/utils/objectValues";

export const MALUS_TIME_TYPE = {
  HOUR: "HOUR",
  DAY: "DAY",
  WEEK: "WEEK",
} as const;

export type MalusTimeType = ObjectValues<typeof MALUS_TIME_TYPE>;
