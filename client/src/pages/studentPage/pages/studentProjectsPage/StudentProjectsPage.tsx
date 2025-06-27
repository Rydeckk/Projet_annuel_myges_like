import { useEffect, useMemo, useState } from "react";
import { PromotionProject } from "@/types/PromotionProject";
import { PromotionProjectService } from "@/services/promotionProjectService/PromotionProjectService";
import { ApiException } from "@/services/api/ApiException";
import { toast } from "sonner";
import { StudentProjectCard } from "./components/StudentProjectCard/StudentProjectCard";

export const StudentProjectPage = () => {
    const promotionProjectService = useMemo(
        () => new PromotionProjectService(),
        [],
    );

    const [promotionProjects, setPromotionProjects] = useState<
        PromotionProject[]
    >([]);

    useEffect(() => {
        const getStudentProjects = async () => {
            try {
                const studentProjects =
                    await promotionProjectService.findCurrentStudentPromotionProjects();
                setPromotionProjects(studentProjects);
            } catch (error) {
                if (error instanceof ApiException) {
                    toast.error(error.message);
                }
            }
        };
        getStudentProjects();
    }, [promotionProjectService]);

    return (
        <div className="flex flex-col gap-4 mt-10">
            {promotionProjects.map((promotionProject) => (
                <StudentProjectCard
                    key={promotionProject.id}
                    promotionProject={promotionProject}
                />
            ))}
        </div>
    );
};
