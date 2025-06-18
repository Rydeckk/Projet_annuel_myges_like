import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TeacherPromotionDetailContext } from "@/pages/teacherPage/contexts/PromotionDetailContext";
import { PROJECT_GROUP_RULE } from "@/enums/ProjectGroupRule";
import { ApiException } from "@/services/api/ApiException";
import { ProjectService } from "@/services/projectService/ProjectService";
import { Project } from "@/types/Project";
import { PromotionProjectRequest } from "@/types/PromotionProject";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
    minPerGroup: z.number(),
    maxPerGroup: z.number(),
    allowLateSubmission: z.boolean(),
    projectGroupRule: z.nativeEnum(PROJECT_GROUP_RULE),
    promotionId: z.string().uuid().nonempty(),
    projectId: z
        .string({ required_error: "Project is required" })
        .uuid()
        .nonempty(),
});

type Props = {
    onSubmit: (data: PromotionProjectRequest) => void;
};

export const PromotionProjectFrom = ({ onSubmit }: Props) => {
    const { promotion } = useContext(TeacherPromotionDetailContext);

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<PromotionProjectRequest>({
        resolver: zodResolver(schema),
        defaultValues: {
            allowLateSubmission: false,
            projectGroupRule: PROJECT_GROUP_RULE.RANDOM,
            promotionId: promotion?.id,
        },
    });

    const projectService = useMemo(() => new ProjectService(), []);

    const [projects, setProjects] = useState<Project[]>([]);

    const getProjects = useCallback(async () => {
        try {
            const projectsData = await projectService.getTeacherProjects();
            setProjects(projectsData);
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    }, [projectService]);

    useEffect(() => {
        getProjects();
    }, [getProjects]);

    return (
        <form
            className="flex flex-col gap-4 px-4"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="flex flex-col gap-2">
                <Label htmlFor="min-per-group">Min per group</Label>
                <Input
                    id="min-per-group"
                    type="number"
                    {...register("minPerGroup", { valueAsNumber: true })}
                />
                <p className="text-red-500">{errors.minPerGroup?.message}</p>
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="max-per-group">Max per group</Label>
                <Input
                    id="max-per-group"
                    type="number"
                    {...register("maxPerGroup", { valueAsNumber: true })}
                />
                <p className="text-red-500">{errors.maxPerGroup?.message}</p>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                    <Label htmlFor="allow-late-submission">
                        Allow late submission
                    </Label>
                    <Switch
                        id="allow-late-submission"
                        {...register("allowLateSubmission")}
                    />
                </div>
                <p className="text-red-500">
                    {errors.allowLateSubmission?.message}
                </p>
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="projectGroupRule">Project group rule</Label>
                <Controller
                    name="projectGroupRule"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            defaultValue={PROJECT_GROUP_RULE.RANDOM}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(PROJECT_GROUP_RULE).map(
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

            <div className="flex flex-col gap-2">
                <Label htmlFor="projectId">Project</Label>
                <Controller
                    name="projectId"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value}
                            onValueChange={field.onChange}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a project" />
                            </SelectTrigger>
                            <SelectContent>
                                {projects.map((project) => (
                                    <SelectItem
                                        key={project.id}
                                        value={project.id}
                                    >
                                        {project.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                <p className="text-red-500">{errors.projectId?.message}</p>
            </div>

            <Button type="submit">Save</Button>
        </form>
    );
};
