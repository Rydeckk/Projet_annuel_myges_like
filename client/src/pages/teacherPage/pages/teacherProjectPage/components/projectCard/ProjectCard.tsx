import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { TeacherProjectContext } from "@/pages/teacherPage/contexts/TeacherProjectContext";
import { ApiException } from "@/services/api/ApiException";
import { ProjectService } from "@/services/projectService/ProjectService";
import { Project, ProjectRequest } from "@/types/Project";
import { format } from "date-fns";
import { useContext, useMemo, useState } from "react";
import { toast } from "sonner";
import { ProjectForm } from "../projectForm/ProjectForm";
import { ExpandableCard } from "@/components/ui/expandable-card";
import { Badge } from "@/components/ui/badge";
import { GET_COLOR_STYLES_BY_VISIBILITY } from "@/enums/ProjectVisibility";
import { Clock, Download, ExternalLink } from "lucide-react";
import { Link } from "react-router";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
    project: Project;
};

export const ProjectCard = ({ project }: Props) => {
    const { getProjects } = useContext(TeacherProjectContext);

    const projectService = useMemo(() => new ProjectService(), []);

    const [open, setOpen] = useState(false);

    const onUpdateProject = async (data: Partial<ProjectRequest>) => {
        try {
            await projectService.update(project.id, data);
            await getProjects();
            setOpen(false);
            toast.success("The project was successfully updated");
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    };

    const onDeleteProject = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        e.stopPropagation();
        try {
            await projectService.delete(project.id);
            getProjects();
            setOpen(false);
            toast.success("The project was successfully deleted");
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    };

    return (
        <div className="w-[23rem]">
            <ExpandableCard
                title={project.name}
                description={project.description}
                headerContent={
                    <div className="w-full flex justify-between items-center">
                        <Badge
                            variant="secondary"
                            className={
                                GET_COLOR_STYLES_BY_VISIBILITY[
                                    project.projectVisibility
                                ]
                            }
                        >
                            {project.projectVisibility}
                        </Badge>
                        <div className="flex gap-4">
                            <TooltipProvider>
                                <Tooltip>
                                    {project?.path && (
                                        <TooltipTrigger asChild>
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className="h-8 w-8"
                                                asChild
                                            >
                                                <Link
                                                    to={project.path}
                                                    target="_blank"
                                                >
                                                    <Download />
                                                </Link>
                                            </Button>
                                        </TooltipTrigger>
                                    )}
                                    <TooltipContent>
                                        <p>Download project file</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            className="h-8 w-8"
                                            asChild
                                        >
                                            <Link to="">
                                                <ExternalLink className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>View</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                }
                disabled
            >
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{`Created at : ${format(project.createdAt, "HH:mm - dd-MM-yyyy")}`}</span>
                    </div>
                </div>
                <div className="flex items-center justify-between w-full text-sm text-gray-600">
                    <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{`Updated at : ${format(project.updatedAt, "HH:mm - dd-MM-yyyy")}`}</span>
                    </div>
                </div>
                <div className="flex justify-between">
                    <Button
                        className="w-[45%]"
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpen(true);
                        }}
                    >
                        Update
                    </Button>
                    <Button className="w-[45%]" onClick={onDeleteProject}>
                        Delete
                    </Button>
                </div>
            </ExpandableCard>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent className="p-4">
                    <SheetHeader>
                        <SheetTitle>Update project</SheetTitle>
                    </SheetHeader>
                    <ProjectForm
                        onSubmit={(data) => onUpdateProject(data)}
                        projectData={project}
                    />
                </SheetContent>
            </Sheet>
        </div>
    );
};
