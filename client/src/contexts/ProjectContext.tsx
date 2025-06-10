import { ApiException } from "@/services/api/ApiException";
import { ProjectService } from "@/services/projectService/ProjectService";
import { Project } from "@/types/Project";
import {
    createContext,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { toast } from "sonner";

type ContextValue = {
    projects: Project[];
    getProjects: () => Promise<void>;
};

const ProjectContext = createContext<ContextValue>({
    projects: [],
    getProjects: async () => {},
});

type Props = {
    children: ReactNode;
};

const ProjectContextProvider = ({ children }: Props) => {
    const projectService = useMemo(() => new ProjectService(), []);
    const [projects, setProjects] = useState<Project[]>([]);

    const getProjects = useCallback(async () => {
        try {
            const projectsData = await projectService.getTeacherProjects();
            setProjects(projectsData);
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    }, [projectService]);

    useEffect(() => {
        getProjects();
    }, [getProjects]);

    const data = useMemo(
        () => ({ projects, getProjects }),
        [projects, getProjects],
    );

    return (
        <ProjectContext.Provider value={data}>
            {children}
        </ProjectContext.Provider>
    );
};

export { ProjectContext, ProjectContextProvider };
