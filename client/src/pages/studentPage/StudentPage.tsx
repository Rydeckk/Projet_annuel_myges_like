import { AppSidebar, NavData } from "@/components/sidebar/AppSidebar";
import { AuthentifiedWrapper } from "@/components/wrappers/AuthentifiedWrapper";
import { StudentContextProvider } from "@/contexts/StudentContext";
import { USER_ROLE } from "@/enums/UserRole";
import { Outlet } from "react-router";

const navData: NavData[] = [
    {
        title: "Project",
        items: [
            {
                title: "My projects",
                url: "projects",
            },
        ],
    },
];

export const StudentPage = () => {
    return (
        <AuthentifiedWrapper scope={USER_ROLE.STUDENT}>
            <StudentContextProvider>
                <AppSidebar title="Student" path="/student" navData={navData}>
                    <div className="flex flex-1 flex-col gap-4 p-4">
                        <Outlet />
                    </div>
                </AppSidebar>
            </StudentContextProvider>
        </AuthentifiedWrapper>
    );
};
