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

type ContextProps = {
    projects: Project[];
    getProjects: () => Promise<void>;
};

const TeacherProjectContext = createContext<ContextProps>({
    projects: [],
    getProjects: async () => {},
});

type Props = {
    children: ReactNode;
};

const TeacherProjectContextProvider = ({ children }: Props) => {
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
        <TeacherProjectContext.Provider value={data}>
            {children}
        </TeacherProjectContext.Provider>
    );
};

export { TeacherProjectContext, TeacherProjectContextProvider };
