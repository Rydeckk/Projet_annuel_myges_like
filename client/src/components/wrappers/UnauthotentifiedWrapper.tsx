import { USER_ROLE } from "@/enums/UserRole";
import { decodeToken } from "@/utils/jwt";
import Cookies from "js-cookie";
import { ReactNode } from "react";
import { Navigate } from "react-router";

export const UnauthotentifiedWrapper = ({
    children,
}: {
    children: ReactNode;
}) => {
    const token = Cookies.get("token");
    const decodedToken = decodeToken(token);

    const path =
        decodedToken?.scope === USER_ROLE.STUDENT ? "/student" : "/teacher";

    return decodedToken?.scope ? <Navigate to={path} /> : children;
};
