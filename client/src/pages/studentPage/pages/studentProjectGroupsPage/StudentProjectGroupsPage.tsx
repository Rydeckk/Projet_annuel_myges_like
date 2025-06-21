import { useContext } from "react";
import { StudentPromotionProjectContext } from "../../contexts/StudentPromotionProjectContext";
import { StudentProjectGroupsCard } from "./components/studentProjectGroupsCard/StudentProjectGroupsCard";

export const StudentProjectGroupsPage = () => {
    const { promotionProject } = useContext(StudentPromotionProjectContext);
    const projectGroups = promotionProject?.projectGroups ?? [];

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Project Groups</h1>
            {projectGroups.map((projectGroup) => (
                <StudentProjectGroupsCard
                    key={projectGroup.id}
                    projectGroup={projectGroup}
                />
            ))}
        </div>
    );
};
