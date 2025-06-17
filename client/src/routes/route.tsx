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
import { PromotionContextProvider } from "@/contexts/PromotionContext";
import { PromotionDetailContextProvider } from "@/contexts/PromotionDetailContext";
import { TeacherPromotionDetailPage } from "@/pages/teacherPage/pages/teacherPromotionDetailPage/TeacherPromotionDetailPage";

export const ROUTER = createBrowserRouter([
    {
        path: "/",
        Component: App,
    },
    {
        path: "student",
        Component: StudentPage,
        children: [],
    },
    {
        path: "teacher",
        Component: TeacherPage,
        children: [
            {
                path: "promotions",
                element: (
                    <PromotionContextProvider>
                        <Outlet />
                    </PromotionContextProvider>
                ),
                children: [
                    {
                        path: "",
                        Component: TeacherPromotionsPage,
                    },
                    {
                        path: ":promotionName",
                        element: (
                            <PromotionDetailContextProvider>
                                <Outlet />
                            </PromotionDetailContextProvider>
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
                path: "project",
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
