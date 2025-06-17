import { ProjectContextProvider } from "@/contexts/ProjectContext";
import { Project } from "./components/project/Project";

export const TeacherProjectPage = () => (
    <ProjectContextProvider>
        <Project />
    </ProjectContextProvider>
);
