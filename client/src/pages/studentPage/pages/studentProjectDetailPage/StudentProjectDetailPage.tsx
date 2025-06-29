import { useContext } from "react";
import { StudentPromotionProjectContext } from "../../contexts/StudentPromotionProjectContext";
import { StudentProjectDetailCard } from "./components/studentProjectDetailCard/StudentProjectDetailCard";

export const StudentProjectDetailPage = () => {
    const { promotionProject, studentProjectGroup } = useContext(
        StudentPromotionProjectContext,
    );

    return (
        <div>
            {promotionProject && studentProjectGroup && (
                <StudentProjectDetailCard
                    projectGroup={studentProjectGroup}
                    promotionProject={promotionProject}
                />
            )}
        </div>
    );
};
