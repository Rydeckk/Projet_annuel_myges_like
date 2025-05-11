import { useEffect, useMemo, useRef } from "react";
import { ApiException } from "@/services/api/ApiException";
import { AuthService } from "@/services/authService/AuthService";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { USER_ROLE } from "@/enums/UserRole";
import { LoginResponseSchema } from "@/schemas/AuthSchema";
import { SSO_TYPE, SsoType } from "@/enums/SsoType";

export const SsoRedirect = ({ ssoType }: { ssoType: SsoType }) => {
    const navigate = useNavigate();

    const authService = useMemo(() => new AuthService(), []);

    const hasHandledRedirect = useRef(false);

    const queryString = window.location.search;

    useEffect(() => {
        const ssoRedirect = async () => {
            try {
                const { accessToken, userRole } = await (
                    ssoType === SSO_TYPE.GOOGLE
                        ? authService.googleRedirect.bind(authService)
                        : authService.microsoftRedirect.bind(authService)
                )(queryString).then(LoginResponseSchema.parse);
                Cookies.set("token", accessToken);
                toast.success("Login successfull");
                navigate(
                    userRole === USER_ROLE.STUDENT ? "/student" : "/teacher",
                );
            } catch (error) {
                if (error instanceof ApiException) {
                    toast.error(error.message);
                }
            }
        };

        if (queryString && !hasHandledRedirect.current) {
            hasHandledRedirect.current = true;
            ssoRedirect();
        }
    }, [queryString]);

    return <></>;
};
