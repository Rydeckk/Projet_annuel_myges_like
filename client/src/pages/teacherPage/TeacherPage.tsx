import { AuthentifiedWrapper } from "@/components/wrappers/AuthentifiedWrapper";
import { TeacherContextProvider } from "@/contexts/TeacherContext";
import { USER_ROLE } from "@/enums/UserRole";
import { AppSidebar, NavData } from "@/components/sidebar/AppSidebar";
import { Outlet } from "react-router";

const navData: NavData[] = [
    {
        title: "Promotion",
        items: [
            {
                title: "Promotions management",
                url: "promotions",
            },
        ],
    },
    {
        title: "Project",
        items: [
            {
                title: "Project management",
                url: "projects",
            },
        ],
    },
];

export const TeacherPage = () => {
    return (
        <AuthentifiedWrapper scope={USER_ROLE.TEACHER}>
            <TeacherContextProvider>
                <AppSidebar title="Teacher" path="/teacher" navData={navData}>
                    <div className="flex flex-1 flex-col gap-4 p-4">
                        <Outlet />
                    </div>
                </AppSidebar>
            </TeacherContextProvider>
        </AuthentifiedWrapper>
    );
};
