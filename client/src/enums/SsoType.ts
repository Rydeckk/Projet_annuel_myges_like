import { ObjectValues } from "@/utils/objectValues";

export const SSO_TYPE = {
  GOOGLE: "google",
  MICROSOFT: "microsoft",
} as const;

export type SsoType = ObjectValues<typeof SSO_TYPE>;
