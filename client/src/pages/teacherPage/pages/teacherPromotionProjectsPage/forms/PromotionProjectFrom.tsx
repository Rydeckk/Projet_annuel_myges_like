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
import { TeacherPromotionDetailContext } from "@/pages/teacherPage/contexts/TeacherPromotionDetailContext";
import { PROJECT_GROUP_RULE } from "@/enums/ProjectGroupRule";
import { ApiException } from "@/services/api/ApiException";
import { ProjectService } from "@/services/projectService/ProjectService";
import { Project } from "@/types/Project";
import {
    PromotionProject,
    PromotionProjectRequest,
} from "@/types/PromotionProject";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { isBefore, isEqual, startOfDay } from "date-fns";
import { DateAndTime } from "@/components/dateAndTime/DateAndTime";

const schema = z
    .object({
        minPerGroup: z.number(),
        maxPerGroup: z.number(),
        allowLateSubmission: z.boolean(),
        isReportRequired: z.boolean(),
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
        projectGroupRule: z.nativeEnum(PROJECT_GROUP_RULE),
        promotionId: z.string().uuid().nonempty(),
        projectId: z
            .string({ required_error: "Project is required" })
            .uuid()
            .nonempty(),
    })
    .refine((data) => !isBefore(data.startDate, startOfDay(new Date())), {
        message: "Start date cannot be in the past",
        path: ["startDate"],
    })
    .refine((data) => !isBefore(data.endDate, data.startDate), {
        message: "End date must be after start date",
        path: ["endDate"],
    })
    .refine((data) => !isEqual(data.startDate, data.endDate), {
        message: "Start and end dates cannot be identical",
        path: ["startDate"],
    })
    .refine((data) => !isEqual(data.startDate, data.endDate), {
        message: "Start and end dates cannot be identical",
        path: ["endDate"],
    });

type Props = {
    promotionProject?: PromotionProject;
    onSubmit: (data: PromotionProjectRequest) => void;
};

export const PromotionProjectFrom = ({
    promotionProject = undefined,
    onSubmit,
}: Props) => {
    const { promotion } = useContext(TeacherPromotionDetailContext);

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<PromotionProjectRequest>({
        resolver: zodResolver(schema),
        defaultValues: {
            allowLateSubmission: promotionProject?.allowLateSubmission ?? false,
            isReportRequired: promotionProject?.isReportRequired ?? false,
            projectGroupRule:
                promotionProject?.projectGroupRule ?? PROJECT_GROUP_RULE.FREE,
            promotionId: promotion?.id,
            projectId: promotionProject?.projectId,
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
            className="flex flex-col gap-4 px-4 overflow-y-auto"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="flex flex-col gap-2">
                <Label htmlFor="min-per-group">Min per group</Label>
                <Input
                    id="min-per-group"
                    type="number"
                    {...register("minPerGroup", { valueAsNumber: true })}
                    defaultValue={promotionProject?.minPerGroup}
                />
                <p className="text-red-500">{errors.minPerGroup?.message}</p>
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="max-per-group">Max per group</Label>
                <Input
                    id="max-per-group"
                    type="number"
                    {...register("maxPerGroup", { valueAsNumber: true })}
                    defaultValue={promotionProject?.maxPerGroup}
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
                        defaultChecked={promotionProject?.allowLateSubmission}
                    />
                </div>
                <p className="text-red-500">
                    {errors.allowLateSubmission?.message}
                </p>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                    <Label htmlFor="is-report-required">Report required</Label>
                    <Switch
                        id="is-report-required"
                        {...register("isReportRequired")}
                        defaultChecked={promotionProject?.isReportRequired}
                    />
                </div>
                <p className="text-red-500">
                    {errors.isReportRequired?.message}
                </p>
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="startDate">Start date</Label>
                <Controller
                    name="startDate"
                    control={control}
                    defaultValue={
                        promotionProject
                            ? promotionProject.startDate
                            : undefined
                    }
                    render={({ field }) => (
                        <DateAndTime
                            date={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
                <p className="text-red-500">{errors.startDate?.message}</p>
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="endDate">End date</Label>
                <Controller
                    name="endDate"
                    control={control}
                    defaultValue={
                        promotionProject ? promotionProject.endDate : undefined
                    }
                    render={({ field }) => (
                        <DateAndTime
                            date={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
                <p className="text-red-500">{errors.endDate?.message}</p>
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
                            defaultValue={
                                promotionProject?.projectGroupRule ??
                                PROJECT_GROUP_RULE.FREE
                            }
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

            {!promotionProject && (
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
            )}

            <Button type="submit">Save</Button>
        </form>
    );
};
