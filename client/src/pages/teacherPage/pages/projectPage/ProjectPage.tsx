import { ProjectContextProvider } from "@/contexts/ProjectContext";
import { Project } from "./components/project/Project";

export const ProjectPage = () => (
    <ProjectContextProvider>
        <Project />
    </ProjectContextProvider>
);
