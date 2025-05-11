import { App } from "../App";
import { createBrowserRouter } from "react-router";
import { Student } from "../pages/student/Student";
import { Teacher } from "../pages/teacher/Teacher";
import { SsoRedirect } from "@/pages/ssoRedirect/SsoRedirect";
import { SSO_TYPE } from "@/enums/SsoType";

export const ROUTER = createBrowserRouter([
    {
        path: "/",
        Component: App,
    },
    {
        path: "student",
        Component: Student,
        children: [],
    },
    {
        path: "teacher",
        Component: Teacher,
        children: [],
    },
    {
        path: "google-redirect",
        element: <SsoRedirect ssoType={SSO_TYPE.GOOGLE} />,
    },
    {
        path: "microsoft-redirect",
        element: <SsoRedirect ssoType={SSO_TYPE.MICROSOFT} />,
    },
]);
