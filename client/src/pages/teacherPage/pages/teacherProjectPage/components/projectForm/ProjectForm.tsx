import { PROJECT_VISIBILITY } from "@/enums/ProjectVisibility";
import { Project, ProjectRequest } from "@/types/Project";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const schema = z.object({
    name: z.string().nonempty(),
    description: z.string().nonempty(),
    projectVisibility: z.nativeEnum(PROJECT_VISIBILITY),
});

type Props = {
    onSubmit: (data: ProjectRequest) => void;
    projectData?: Project;
};

export const ProjectForm = ({ onSubmit, projectData = undefined }: Props) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<ProjectRequest>({
        resolver: zodResolver(schema),
        defaultValues: {
            projectVisibility:
                projectData?.projectVisibility ?? PROJECT_VISIBILITY.DRAFT,
        },
    });

    return (
        <form
            className="flex flex-col gap-4 px-4 mt-6"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    {...register("name")}
                    defaultValue={projectData?.name}
                />
                <p className="text-red-500">{errors.name?.message}</p>
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                    id="description"
                    {...register("description")}
                    defaultValue={projectData?.description}
                />
                <p className="text-red-500">{errors.description?.message}</p>
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="projectVisibility">Project visibility</Label>
                <Controller
                    name="projectVisibility"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            defaultValue={
                                projectData?.projectVisibility ??
                                PROJECT_VISIBILITY.DRAFT
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(PROJECT_VISIBILITY).map(
                                    (visibility) => (
                                        <SelectItem
                                            key={visibility}
                                            value={visibility}
                                        >
                                            {visibility}
                                        </SelectItem>
                                    ),
                                )}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
            <Button type="submit">Save</Button>
        </form>
    );
};
