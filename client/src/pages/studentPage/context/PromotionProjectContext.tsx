import { ApiException } from "@/services/api/ApiException";
import { PromotionProjectService } from "@/services/promotionProjectService/PromotionProjectService";
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
    getPromotionProject: () => Promise<void>;
};

const PromotionProjectContext = createContext<ContextProps>({
    promotionProject: null,
    getPromotionProject: async () => {},
});

type Props = {
    children: ReactNode;
};

const PromotionProjectContextProvider = ({ children }: Props) => {
    const { projectName } = useParams();

    const promotionProjectService = useMemo(
        () => new PromotionProjectService(),
        [],
    );

    const [promotionProject, setPromotionProject] =
        useState<PromotionProject | null>(null);

    const getPromotionProject = useCallback(async () => {
        try {
            if (projectName) {
                const promotionProjectData =
                    await promotionProjectService.findByProjectName(
                        projectName,
                    );
                setPromotionProject(promotionProjectData);
            }
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
        () => ({ promotionProject, getPromotionProject }),
        [promotionProject, getPromotionProject],
    );

    return (
        <PromotionProjectContext.Provider value={data}>
            {children}
        </PromotionProjectContext.Provider>
    );
};

export { PromotionProjectContext, PromotionProjectContextProvider };
