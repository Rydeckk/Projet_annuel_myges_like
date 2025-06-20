import { ApiException } from "@/services/api/ApiException";
import { ProjectGroupService } from "@/services/projectGroupService/ProjectGroupService";
import { ProjectGroup } from "@/types/ProjectGroup";
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { toast } from "sonner";
import { PromotionProjectContext } from "./PromotionProjectContext";

type ContextProps = {
    projectGroup: ProjectGroup | null;
    getProjectGroup: () => Promise<void>;
};

const ProjectGroupContext = createContext<ContextProps>({
    projectGroup: null,
    getProjectGroup: async () => {},
});

type Props = {
    children: ReactNode;
};

const ProjectGroupContextProvider = ({ children }: Props) => {
    const { promotionProject } = useContext(PromotionProjectContext);

    const promotionProjectService = useMemo(
        () => new ProjectGroupService(),
        [],
    );

    const [projectGroup, setProjectGroup] = useState<ProjectGroup | null>(null);

    const getProjectGroup = useCallback(async () => {
        try {
            if (promotionProject) {
                const promotionProjectData =
                    await promotionProjectService.getMyProjectGroup(
                        promotionProject.id,
                    );
                setProjectGroup(promotionProjectData);
            }
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    }, [promotionProject, promotionProjectService]);

    useEffect(() => {
        if (promotionProject) {
            getProjectGroup();
        }
    }, [promotionProject, getProjectGroup]);

    const data = useMemo(
        () => ({ projectGroup, getProjectGroup }),
        [projectGroup, getProjectGroup],
    );

    return (
        <ProjectGroupContext.Provider value={data}>
            {children}
        </ProjectGroupContext.Provider>
    );
};

export { ProjectGroupContext, ProjectGroupContextProvider };
