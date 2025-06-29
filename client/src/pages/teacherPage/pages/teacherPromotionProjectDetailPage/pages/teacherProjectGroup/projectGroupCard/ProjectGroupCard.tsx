import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { ProjectGroup, ProjectGroupRequest } from "@/types/ProjectGroup";
import { useContext, useMemo, useState } from "react";
import { ProjectGroupForm } from "../../projectGroupForm/ProjectGroupForm";
import { ApiException } from "@/services/api/ApiException";
import { toast } from "sonner";
import { ProjectGroupService } from "@/services/projectGroupService/ProjectGroupService";
import { TeacherPromotionProjectDetailContext } from "@/pages/teacherPage/contexts/TeacherPromotionProjectDetailContext";
import { ProjectGroupStudentWithAction } from "./projectGroupStudentWithAction/ProjectGroupStudentWithAction";
import { Edit } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
    projectGroup: ProjectGroup;
};

export const ProjectGroupCard = ({ projectGroup }: Props) => {
    const { getPromotionProject } = useContext(
        TeacherPromotionProjectDetailContext,
    );

    const projectGroupService = useMemo(() => new ProjectGroupService(), []);

    const [open, setOpen] = useState(false);
    const [openStudents, setOpenStudents] = useState(false);

    const onUpdateGroup = async (
        data: Omit<ProjectGroupRequest, "promotionProjectId">,
    ) => {
        try {
            await projectGroupService.update(projectGroup.id, {
                ...data,
            });
            setOpen(false);
            await getPromotionProject();
            toast.success("Project group was successfully updated");
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    };

    const onDeleteProjectGroup = async () => {
        try {
            await projectGroupService.delete(projectGroup.id);
            await getPromotionProject();
            toast.success("Project group was successfully updated");
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    };

    return (
        <Card className="w-[23rem] p-4">
            <CardTitle className="flex justify-between items-center">
                <h1>{projectGroup.name}</h1>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8"
                                onClick={() => setOpenStudents(true)}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Update students group</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </CardTitle>
            <CardContent>
                <ProjectGroupStudentWithAction
                    open={openStudents}
                    setOpen={setOpenStudents}
                    projectGroup={projectGroup}
                    projectGroupStudents={
                        projectGroup?.projectGroupStudents ?? []
                    }
                />
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button
                    className="w-[45%]"
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpen(true);
                    }}
                >
                    Update
                </Button>
                <Button className="w-[45%]" onClick={onDeleteProjectGroup}>
                    Delete
                </Button>
            </CardFooter>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent className="p-4">
                    <SheetHeader>
                        <SheetTitle>Update project group</SheetTitle>
                    </SheetHeader>
                    <ProjectGroupForm
                        onSubmit={onUpdateGroup}
                        projectGroup={projectGroup}
                    />
                </SheetContent>
            </Sheet>
        </Card>
    );
};
