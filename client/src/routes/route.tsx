import { App } from "../App";
import { createBrowserRouter, Outlet } from "react-router";
import { StudentPage } from "../pages/studentPage/StudentPage";
import { TeacherPage } from "../pages/teacherPage/TeacherPage";
import { SsoRedirectPage } from "@/pages/ssoRedirectPage/SsoRedirectPage";
import { SSO_TYPE } from "@/enums/SsoType";
import { TeacherProjectPage } from "@/pages/teacherPage/pages/teacherProjectPage/TeacherProjectPage";
import { TeacherPromotionProjectsPage } from "@/pages/teacherPage/pages/teacherPromotionProjectsPage/TeacherPromotionProjectsPage";
import { TeacherPromotionStudentsPage } from "@/pages/teacherPage/pages/teacherPromotionStudentsPage/TeacherPromotionStudentsPage";
import { TeacherPromotionsPage } from "@/pages/teacherPage/pages/teacherPromotionsPage/components/TeacherPromotionsPage";
import { TeacherPromotionContextProvider } from "@/pages/teacherPage/contexts/TeacherPromotionContext";
import { TeacherPromotionDetailContextProvider } from "@/pages/teacherPage/contexts/PromotionDetailContext";
import { TeacherPromotionDetailPage } from "@/pages/teacherPage/pages/teacherPromotionDetailPage/TeacherPromotionDetailPage";
import { StudentProjectPage } from "@/pages/studentPage/pages/studentProjectsPage/StudentProjectsPage";
import { StudentProjectDetailPage } from "@/pages/studentPage/pages/studentProjectDetailPage/StudentProjectDetailPage";
import { StudentProjectGroupsPage } from "@/pages/studentPage/pages/studentProjectGroupsPage/StudentProjectGroupsPage";

export const ROUTER = createBrowserRouter([
    {
        path: "/",
        Component: App,
    },
    {
        path: "student",
        Component: StudentPage,
        children: [
            {
                path: "projects",
                Component: StudentProjectPage,
                children: [
                    {
                        path: ":projectName",
                        Component: StudentProjectDetailPage,
                        children: [
                            {
                                path: "groups",
                                Component: StudentProjectGroupsPage,
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        path: "teacher",
        Component: TeacherPage,
        children: [
            {
                path: "promotions",
                element: (
                    <TeacherPromotionContextProvider>
                        <Outlet />
                    </TeacherPromotionContextProvider>
                ),
                children: [
                    {
                        path: "",
                        Component: TeacherPromotionsPage,
                    },
                    {
                        path: ":promotionName",
                        element: (
                            <TeacherPromotionDetailContextProvider>
                                <Outlet />
                            </TeacherPromotionDetailContextProvider>
                        ),
                        children: [
                            {
                                path: "",
                                Component: TeacherPromotionDetailPage,
                            },
                            {
                                path: "students",
                                Component: TeacherPromotionStudentsPage,
                            },
                            {
                                path: "projects",
                                Component: TeacherPromotionProjectsPage,
                            },
                        ],
                    },
                ],
            },
            {
                path: "projects",
                Component: TeacherProjectPage,
            },
        ],
    },
    {
        path: "google-redirect",
        element: <SsoRedirectPage ssoType={SSO_TYPE.GOOGLE} />,
    },
    {
        path: "microsoft-redirect",
        element: <SsoRedirectPage ssoType={SSO_TYPE.MICROSOFT} />,
    },
]);
