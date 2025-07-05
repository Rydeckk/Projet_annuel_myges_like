import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TeacherPromotionProjectDetailContext } from "@/pages/teacherPage/contexts/TeacherPromotionProjectDetailContext";
import { ReportSectionRequest } from "@/types/ReportSection";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
    title: z.string().nonempty(),
    description: z.string().optional(),
    promotionProjectId: z.string().uuid(),
});

type TeacherPromotionProjectsReportSectionsFormProps = {
    onSubmit: (data: ReportSectionRequest) => void;
};

export const TeacherPromotionProjectsReportSectionsForm = ({
    onSubmit,
}: TeacherPromotionProjectsReportSectionsFormProps) => {
    const { promotionProject } = useContext(
        TeacherPromotionProjectDetailContext,
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ReportSectionRequest>({
        resolver: zodResolver(schema),
        defaultValues: {
            promotionProjectId: promotionProject?.id,
        },
    });

    return (
        <form
            className="flex flex-col gap-4 px-4 overflow-y-auto"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="flex flex-col gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" type="string" {...register("title")} />
                <p className="text-red-500">{errors.title?.message}</p>
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    className="border rounded p-2"
                    rows={4}
                    {...register("description")}
                />
                <p className="text-red-500">{errors.description?.message}</p>
            </div>
            <Button type="submit">Save</Button>
        </form>
    );
};
