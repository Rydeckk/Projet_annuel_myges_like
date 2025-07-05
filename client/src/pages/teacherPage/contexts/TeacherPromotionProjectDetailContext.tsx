import { ApiException } from "@/services/api/ApiException";
import { PromotionProjectService } from "@/services/promotionProjectService/PromotionProjectService";
import { ProjectGroup } from "@/types/ProjectGroup";
import { PromotionProject } from "@/types/PromotionProject";
import {
    createContext,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useParams } from "react-router";
import { toast } from "sonner";

type ContextProps = {
    promotionProject: PromotionProject | null;
    projectGroups: ProjectGroup[];
    getPromotionProject: () => Promise<void>;
};

const TeacherPromotionProjectDetailContext = createContext<ContextProps>({
    promotionProject: null,
    projectGroups: [],
    getPromotionProject: async () => {},
});

type Props = {
    children: ReactNode;
};

const TeacherPromotionProjectDetailContextProvider = ({ children }: Props) => {
    const { projectName } = useParams();

    const promotionProjectService = useMemo(
        () => new PromotionProjectService(),
        [],
    );

    const [promotionProject, setPromotionProject] =
        useState<PromotionProject | null>(null);

    const projectGroups = useMemo(
        () => promotionProject?.projectGroups ?? [],
        [promotionProject?.projectGroups],
    );

    const getPromotionProject = useCallback(async () => {
        try {
            const projectData =
                await promotionProjectService.teacherFindByProjectName(
                    projectName ?? "",
                );
            setPromotionProject(projectData);
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    }, [projectName, promotionProjectService]);

    useEffect(() => {
        getPromotionProject();
    }, []);

    const data = useMemo(
        () => ({ promotionProject, projectGroups, getPromotionProject }),
        [promotionProject, projectGroups, getPromotionProject],
    );

    return (
        <TeacherPromotionProjectDetailContext.Provider value={data}>
            {children}
        </TeacherPromotionProjectDetailContext.Provider>
    );
};

export {
    TeacherPromotionProjectDetailContext,
    TeacherPromotionProjectDetailContextProvider,
};
