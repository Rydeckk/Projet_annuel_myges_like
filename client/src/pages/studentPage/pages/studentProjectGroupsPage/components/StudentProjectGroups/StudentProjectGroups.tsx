import { PromotionProjectContext } from "@/pages/studentPage/context/PromotionProjectContext";
import { ApiException } from "@/services/api/ApiException";
import { ProjectGroupService } from "@/services/projectGroupService/ProjectGroupService";
import { ProjectGroup } from "@/types/ProjectGroup";
import { useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { StudentProjectGroupsCard } from "../StudentProjectGroupsCard/StudentProjectGroupsCard";

export const StudentProjectGroups = () => {
    const { promotionProject } = useContext(PromotionProjectContext);
    const projectGroupService = useMemo(() => new ProjectGroupService(), []);
    const [projectGroups, setProjectGroups] = useState<ProjectGroup[]>([]);

    useEffect(() => {
        const fetchProjectGroups = async () => {
            try {
                if (promotionProject) {
                    const groups = await projectGroupService.getProjectGroups(
                        promotionProject.id,
                    );
                    setProjectGroups(groups);
                }
            } catch (error) {
                if (error instanceof ApiException) {
                    toast.error(error.message);
                }
            }
        };
        fetchProjectGroups();
    }, [projectGroupService, promotionProject]);

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Project Groups</h1>
            {projectGroups.length > 0 ? (
                projectGroups.map(
                    (group) =>
                        group.projectGroupStudents && (
                            <StudentProjectGroupsCard
                                key={group.id}
                                projectGroup={group}
                            />
                        ),
                )
            ) : (
                <p className="text-gray-500">No project groups found.</p>
            )}
        </div>
    );
};
