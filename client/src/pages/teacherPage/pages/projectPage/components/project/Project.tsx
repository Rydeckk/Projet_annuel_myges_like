import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ProjectContext } from "@/contexts/ProjectContext";
import { ApiException } from "@/services/api/ApiException";
import { ProjectService } from "@/services/projectService/ProjectService";
import { ProjectRequest } from "@/types/Project";
import { CirclePlus } from "lucide-react";
import { useContext, useMemo, useState } from "react";
import { toast } from "sonner";
import { ProjectForm } from "../projectForm/ProjectForm";
import { ProjectCard } from "../projectCard/ProjectCard";

export const Project = () => {
    const { projects, getProjects } = useContext(ProjectContext);
    const projectService = useMemo(() => new ProjectService(), []);

    const [open, setOpen] = useState(false);

    const onCreateProject = async (data: ProjectRequest) => {
        try {
            await projectService.create(data);
            await getProjects();
            setOpen(false);
            toast.success("The project was successfully created");
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold">Project management</h1>
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger>
                        <Button className="ml-auto" variant="outline">
                            <CirclePlus />
                            Create project
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="p-4">
                        <SheetHeader>
                            <SheetTitle>Create project</SheetTitle>
                            <ProjectForm onSubmit={onCreateProject} />
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>
            <div className="flex flex-col gap-4 mt-10">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </div>
    );
};
