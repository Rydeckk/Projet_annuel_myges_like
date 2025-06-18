import { TeacherProjectContextProvider } from "@/pages/teacherPage/contexts/TeacherProjectContext";
import { Project } from "./components/project/Project";

export const TeacherProjectPage = () => (
    <TeacherProjectContextProvider>
        <Project />
    </TeacherProjectContextProvider>
);
