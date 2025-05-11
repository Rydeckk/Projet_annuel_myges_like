import { AuthentifiedWrapper } from "@/components/wrappers/AuthentifiedWrapper";
import { TeacherContextProvider } from "@/contexts/TeacherContext";
import { USER_ROLE } from "@/enums/UserRole";

export const Teacher = () => {
    return (
        <AuthentifiedWrapper scope={USER_ROLE.TEACHER}>
            <TeacherContextProvider>Teacher</TeacherContextProvider>
        </AuthentifiedWrapper>
    );
};
