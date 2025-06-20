import { ProjectGroupContext } from "@/pages/studentPage/context/ProjectGroupContext";
import { PromotionProjectContext } from "@/pages/studentPage/context/PromotionProjectContext";
import { useContext } from "react";
import { StudentProjectDetailCard } from "../StudentProjectDetailCard/StudentProjectDetailCard";

export const StudentProjectDetail = () => {
    const { projectGroup } = useContext(ProjectGroupContext);
    const { promotionProject } = useContext(PromotionProjectContext);

    return (
        <div>
            {promotionProject && projectGroup && (
                <StudentProjectDetailCard
                    projectGroup={projectGroup}
                    promotionProject={promotionProject}
                />
            )}
        </div>
    );
};
