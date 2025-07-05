import { ApiException } from "@/services/api/ApiException";
import { PromotionProjectService } from "@/services/promotionProjectService/PromotionProjectService";
import { ProjectGroup } from "@/types/ProjectGroup";
import { PromotionProject } from "@/types/PromotionProject";
import { Report } from "@/types/Report";
import { decodeToken } from "@/utils/jwt";
import Cookies from "js-cookie";
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
    studentProjectGroup: ProjectGroup | null;
    studentProjectGroupReports: Report[];
    getPromotionProject: () => Promise<void>;
};

const StudentPromotionProjectContext = createContext<ContextProps>({
    promotionProject: null,
    studentProjectGroup: null,
    studentProjectGroupReports: [],
    getPromotionProject: async () => {},
});

type Props = {
    children: ReactNode;
};

const StudentPromotionProjectContextProvider = ({ children }: Props) => {
    const { projectName } = useParams();

    const promotionProjectService = useMemo(
        () => new PromotionProjectService(),
        [],
    );

    const [promotionProject, setPromotionProject] =
        useState<PromotionProject | null>(null);

    const token = Cookies.get("token");
    const decodedToken = decodeToken(token);
    const studentId = decodedToken?.sub;

    const studentProjectGroup = useMemo(
        () =>
            promotionProject?.projectGroups?.find(({ projectGroupStudents }) =>
                projectGroupStudents?.find(
                    (projectGroupStudent) =>
                        projectGroupStudent.studentId === studentId,
                ),
            ) ?? null,
        [promotionProject?.projectGroups, studentId],
    );

    const studentProjectGroupReports = useMemo(
        () =>
            (promotionProject?.reportSections ?? []).flatMap((sectionReport) =>
                (sectionReport?.reports ?? []).filter(
                    (report) =>
                        report.projectGroupId === studentProjectGroup?.id,
                ),
            ),
        [promotionProject?.reportSections, studentProjectGroup?.id],
    );

    const getPromotionProject = useCallback(async () => {
        try {
            const promotionProjectData =
                await promotionProjectService.studentFindByProjectName(
                    projectName ?? "",
                );
            setPromotionProject(promotionProjectData);
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
        () => ({
            promotionProject,
            studentProjectGroup,
            getPromotionProject,
            studentProjectGroupReports,
        }),
        [
            promotionProject,
            studentProjectGroup,
            getPromotionProject,
            studentProjectGroupReports,
        ],
    );

    return (
        <StudentPromotionProjectContext.Provider value={data}>
            {children}
        </StudentPromotionProjectContext.Provider>
    );
};

export {
    StudentPromotionProjectContext,
    StudentPromotionProjectContextProvider,
};
