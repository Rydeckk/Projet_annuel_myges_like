import { useContext } from "react";
import { StudentPromotionProjectContext } from "../../contexts/StudentPromotionProjectContext";
import { StudentProjectGroupCard } from "./components/studentProjectGroupCard/StudentProjectGroupCard";

export const StudentProjectGroupsPage = () => {
    const { promotionProject } = useContext(StudentPromotionProjectContext);
    const projectGroups = promotionProject?.projectGroups ?? [];

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Project Groups</h1>

            <div className="flex gap-4 mt-6 flex-wrap">
                {projectGroups?.map((projectGroup) => (
                    <StudentProjectGroupCard
                        key={projectGroup.id}
                        projectGroup={projectGroup}
                    />
                ))}
            </div>
        </div>
    );
};
