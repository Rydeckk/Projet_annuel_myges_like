import { JWTPaylod } from "@/types/JwtPaylod";
import { jwtDecode } from "jwt-decode";

export const decodeToken = (token: string = "") => {
  try {
    return jwtDecode<JWTPaylod>(token);
  } catch {
    return undefined;
  }
};
