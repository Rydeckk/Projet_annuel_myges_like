import { PromotionProjectService } from "@/services/promotionProjectService/PromotionProjectService";
import { PromotionProject } from "@/types/PromotionProject";
import { useMemo, useState, useEffect } from "react";
import { StudentProjectCard } from "../StudentProjectCard/StudentProjectCard";

export const StudentProject = () => {
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
                    await promotionProjectService.findStudentProjects();
                setPromotionProjects(studentProjects);
            } catch (error) {
                console.error("Error fetching student projects:", error);
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
