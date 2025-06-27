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
import { TeacherPromotionDetailContextProvider } from "@/pages/teacherPage/contexts/PromotionDetailContext";
import { TeacherPromotionDetailPage } from "@/pages/teacherPage/pages/teacherPromotionDetailPage/TeacherPromotionDetailPage";
import { StudentProjectPage } from "@/pages/studentPage/pages/studentProjectsPage/StudentProjectsPage";
import { StudentProjectDetailPage } from "@/pages/studentPage/pages/studentProjectDetailPage/StudentProjectDetailPage";
import { StudentProjectGroupsPage } from "@/pages/studentPage/pages/studentProjectGroupsPage/StudentProjectGroupsPage";
import { StudentPromotionProjectContextProvider } from "@/pages/studentPage/contexts/StudentPromotionProjectContext";
import { TeacherPromotionProjectsDetailPage } from "@/pages/teacherPage/pages/teacherPromotionProjectsDetailPage/TeacherPromotionProjectsDetailPage";
import { StudentProjectDeliverablePage } from "@/pages/studentPage/pages/studentProjectDeliverablePage/StudentProjectDeliverablePage";

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
            },
            {
                path: "projects/:projectName",
                element: (
                    <StudentPromotionProjectContextProvider>
                        <Outlet />
                    </StudentPromotionProjectContextProvider>
                ),
                children: [
                    {
                        path: "",
                        Component: StudentProjectDetailPage,
                    },
                    {
                        path: "groups",
                        Component: StudentProjectGroupsPage,
                    },
                    {
                        path: "deliverable",
                        Component: StudentProjectDeliverablePage,
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
                Component: TeacherPromotionsPage,
            },
            {
                path: "promotions/:promotionName",
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
                    {
                        path: "projects/:projectName",
                        element: <Outlet />,
                        children: [
                            {
                                path: "",
                                Component: TeacherPromotionProjectsDetailPage,
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
