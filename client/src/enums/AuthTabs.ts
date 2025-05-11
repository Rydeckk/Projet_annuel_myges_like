import { ObjectValues } from "@/utils/objectValues";

export const AUTH_TABS = {
  REGISTER: "register",
  LOGIN: "login",
};

export type AuthTabs = ObjectValues<typeof AUTH_TABS>;
