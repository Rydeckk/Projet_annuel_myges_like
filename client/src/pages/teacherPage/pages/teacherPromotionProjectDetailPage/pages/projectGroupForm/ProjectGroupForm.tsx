import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProjectGroup, ProjectGroupRequest } from "@/types/ProjectGroup";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
    name: z.string().nonempty(),
});

type Props = {
    projectGroup?: ProjectGroup;
    onSubmit: (data: Omit<ProjectGroupRequest, "promotionProjectId">) => void;
};

export const ProjectGroupForm = ({ projectGroup, onSubmit }: Props) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Omit<ProjectGroupRequest, "promotionProjectId">>({
        resolver: zodResolver(schema),
    });

    return (
        <form
            className="flex flex-col gap-4 px-4 overflow-y-auto"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    {...register("name")}
                    defaultValue={projectGroup?.name}
                />
                <p className="text-red-500">{errors.name?.message}</p>
            </div>
            <Button type="submit">Save</Button>
        </form>
    );
};
