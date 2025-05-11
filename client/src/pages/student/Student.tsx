import { AuthentifiedWrapper } from "@/components/wrappers/AuthentifiedWrapper";
import { StudentContextProvider } from "@/contexts/StudentContext";
import { USER_ROLE } from "@/enums/UserRole";

export const Student = () => {
    return (
        <AuthentifiedWrapper scope={USER_ROLE.STUDENT}>
            <StudentContextProvider>Student</StudentContextProvider>
        </AuthentifiedWrapper>
    );
};
