import { App } from "../App";
import { createBrowserRouter } from "react-router";
import { StudentPage } from "../pages/studentPage/StudentPage";
import { TeacherPage } from "../pages/teacherPage/TeacherPage";
import { SsoRedirectPage } from "@/pages/ssoRedirectPage/SsoRedirectPage";
import { SSO_TYPE } from "@/enums/SsoType";
import { PromotionsPage } from "@/pages/teacherPage/pages/promotionsPage/PromotionsPage";
import { PromotionDetailPage } from "@/pages/teacherPage/pages/promotionsPage/components/promotionDetail/PromotionDetailPage";
import { ProjectPage } from "@/pages/teacherPage/pages/projectPage/ProjectPage";

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
                path: "promotion",
                Component: PromotionsPage,
            },
            {
                path: "promotion/:promotionName",
                Component: PromotionDetailPage,
            },
            {
                path: "project",
                Component: ProjectPage,
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
