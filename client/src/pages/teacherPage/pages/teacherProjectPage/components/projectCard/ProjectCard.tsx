import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { ProjectContext } from "@/contexts/ProjectContext";
import { ApiException } from "@/services/api/ApiException";
import { ProjectService } from "@/services/projectService/ProjectService";
import { Project, ProjectRequest } from "@/types/Project";
import { format } from "date-fns";
import { useContext, useMemo, useState } from "react";
import { toast } from "sonner";
import { ProjectForm } from "../projectForm/ProjectForm";

type Props = {
    project: Project;
};

export const ProjectCard = ({ project }: Props) => {
    const { getProjects } = useContext(ProjectContext);

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

    const onDeleteProject = async () => {
        try {
            await projectService.delete(project.id);
            await getProjects();
            setOpen(false);
            toast.success("The project was successfully deleted");
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription className="text-ellipsis line-clamp-4">
                        {project.description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Visibility : {project.projectVisibility}</p>
                    <p>{`Created at : ${format(project.createdAt, "H:m:ss - yyyy-MM-dd")}`}</p>
                    <p>{`Updated at : ${format(project.updatedAt, "H:m:ss - yyyy-MM-dd")}`}</p>
                </CardContent>
                <CardFooter className="flex gap-4">
                    <Button onClick={() => setOpen(true)}>Update</Button>
                    <Button onClick={onDeleteProject}>Delete</Button>
                </CardFooter>
            </Card>
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
        </>
    );
};
