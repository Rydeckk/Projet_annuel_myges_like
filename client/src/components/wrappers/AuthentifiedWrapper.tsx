import { USER_ROLE, UserRole } from "@/enums/UserRole";
import { decodeToken } from "@/utils/jwt";
import Cookies from "js-cookie";
import { ReactNode } from "react";
import { Navigate } from "react-router";

const scopeToPath = {
    [USER_ROLE.STUDENT]: "/teacher",
    [USER_ROLE.TEACHER]: "/student",
};

export const AuthentifiedWrapper = ({
    scope,
    children,
}: {
    scope: UserRole;
    children: ReactNode;
}) => {
    const token = Cookies.get("token");
    const decodedToken = decodeToken(token);

    if (!decodeToken) {
        return <Navigate to="/" />;
    }

    return decodedToken?.scope === scope ? (
        children
    ) : (
        <Navigate to={scopeToPath[scope]} />
    );
};
