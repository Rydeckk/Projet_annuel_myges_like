import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { TeacherPromotionProjectDetailContext } from "@/pages/teacherPage/contexts/TeacherPromotionProjectDetailContext";
import { CirclePlus } from "lucide-react";
import { useContext, useMemo, useState } from "react";
import { ProjectGroupForm } from "../projectGroupForm/ProjectGroupForm";
import { ProjectGroupRequest } from "@/types/ProjectGroup";
import { ApiException } from "@/services/api/ApiException";
import { toast } from "sonner";
import { ProjectGroupService } from "@/services/projectGroupService/ProjectGroupService";
import { ProjectGroupCard } from "./projectGroupCard/ProjectGroupCard";

export const TeacherProjectGroup = () => {
    const { promotionProject, projectGroups, getPromotionProject } = useContext(
        TeacherPromotionProjectDetailContext,
    );

    const projectGroupService = useMemo(() => new ProjectGroupService(), []);

    const [open, setOpen] = useState(false);

    const onCreateGroup = async (
        data: Omit<ProjectGroupRequest, "promotionProjectId">,
    ) => {
        if (!promotionProject) return;
        try {
            await projectGroupService.create({
                ...data,
                promotionProjectId: promotionProject.id,
            });
            setOpen(false);
            getPromotionProject();
            toast.success("Project group was successfully created");
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between py-4">
                <div className="flex flex-col gap-3">
                    <h1 className="text-2xl font-bold">Project Groups</h1>
                    <h2 className="text-1xl font-bold">{`Project: ${promotionProject?.project?.name}`}</h2>
                    <p>{`Min per group: ${promotionProject?.minPerGroup}`}</p>
                    <p>{`Max per group: ${promotionProject?.maxPerGroup}`}</p>
                </div>
                <div className="ml-auto flex gap-4">
                    <Button
                        className="ml-auto"
                        variant="outline"
                        onClick={() => setOpen(true)}
                    >
                        <CirclePlus />
                        Create a project group
                    </Button>
                </div>
            </div>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent className="p-4">
                    <SheetHeader>
                        <SheetTitle>Create project group</SheetTitle>
                    </SheetHeader>
                    <ProjectGroupForm onSubmit={onCreateGroup} />
                </SheetContent>
            </Sheet>
            <div className="flex gap-4 mt-6 flex-wrap">
                {projectGroups?.map((projectGroup) => (
                    <ProjectGroupCard
                        key={projectGroup.id}
                        projectGroup={projectGroup}
                    />
                ))}
            </div>
        </div>
    );
};
