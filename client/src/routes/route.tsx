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
import { TeacherPromotionDetailContextProvider } from "@/pages/teacherPage/contexts/TeacherPromotionDetailContext";
import { TeacherPromotionDetailPage } from "@/pages/teacherPage/pages/teacherPromotionDetailPage/TeacherPromotionDetailPage";
import { StudentProjectPage } from "@/pages/studentPage/pages/studentProjectsPage/StudentProjectsPage";
import { StudentProjectDetailPage } from "@/pages/studentPage/pages/studentProjectDetailPage/StudentProjectDetailPage";
import { StudentPromotionProjectContextProvider } from "@/pages/studentPage/contexts/StudentPromotionProjectContext";
import { TeacherPromotionReportsPage } from "@/pages/teacherPage/pages/teacherPromotionReportsPage/TeacherPromotionReportsPage";
import { TeacherPromotionReportsView } from "@/pages/teacherPage/pages/teacherPromotionReportsPage/components/teacherPromotionReportsView/TeacherPromotionReportsView";
import { TeacherPromotionProjectDetailContextProvider } from "@/pages/teacherPage/contexts/TeacherPromotionProjectDetailContext";
import { TeacherPromotionProjectDetailPage } from "@/pages/teacherPage/pages/teacherPromotionProjectDetailPage/TeacherPromotionProjectDetailPage";
import { TeacherProjectGroup } from "@/pages/teacherPage/pages/teacherPromotionProjectDetailPage/pages/teacherProjectGroup/TeacherProjectGroup";
import { UploadArchiveForm } from "@/pages/project/components/uploadArchiveForm";

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
                        path: "reports",
                        Component: TeacherPromotionReportsPage,
                    },
                    {
                        path: "reports/:projectName",
                        element: <Outlet />,
                        children: [
                            {
                                path: "",
                                element: <Outlet />,
                            },
                            {
                                path: ":groupName",
                                Component: TeacherPromotionReportsView,
                                children: [
                                    {
                                        path: "",
                                    },
                                    {
                                        path: ":sectionReportName",
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        path: "projects/:projectName",
                        element: (
                            <TeacherPromotionProjectDetailContextProvider>
                                <Outlet />
                            </TeacherPromotionProjectDetailContextProvider>
                        ),
                        children: [
                            {
                                path: "",
                                Component: TeacherPromotionProjectDetailPage,
                            },
                            {
                                path: "groups",
                                Component: TeacherProjectGroup,
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
    {
        path: "uploadArchive",
        Component: UploadArchiveForm,
        children: [],
    },
]);
