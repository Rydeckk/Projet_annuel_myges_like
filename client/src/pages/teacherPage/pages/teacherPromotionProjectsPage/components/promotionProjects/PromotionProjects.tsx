import { TeacherPromotionDetailContext } from "@/pages/teacherPage/contexts/PromotionDetailContext";
import { useContext } from "react";

export const PromotionProjects = () => {
    const { promotion } = useContext(TeacherPromotionDetailContext);

    return (
        <div>
            {promotion?.promotionProjects?.map((project) => (
                <p>Project name: {project.project?.name}</p>
            ))}
        </div>
    );
};
