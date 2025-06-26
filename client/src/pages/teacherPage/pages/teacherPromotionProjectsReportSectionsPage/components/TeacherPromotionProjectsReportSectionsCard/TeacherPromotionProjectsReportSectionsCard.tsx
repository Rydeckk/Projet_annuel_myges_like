import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    ReportSection,
    ReportSectionUpdateRequest,
} from "@/types/ReportSection";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDebounce } from "use-debounce";
import { ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const schema = z.object({
    title: z.string().nonempty().optional(),
    description: z.string().optional(),
    order: z
        .number()
        .optional()
        .refine((val) => val === undefined || val > 0, {
            message: "Order must be greater than 0",
        }),
});

type TeacherPromotionProjectsReportSectionsCardProps = {
    sectionReport: ReportSection;
    onUpdate: (id: string, updated: ReportSectionUpdateRequest) => void;
    onDelete: (id: string) => void;
};

export const TeacherPromotionProjectsReportSectionsCard = ({
    sectionReport,
    onUpdate,
    onDelete,
}: TeacherPromotionProjectsReportSectionsCardProps) => {
    const {
        register,
        watch,
        formState: { errors },
    } = useForm<ReportSectionUpdateRequest>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: sectionReport.title ?? "",
            description: sectionReport.description ?? "",
            order: sectionReport.order,
        },
    });

    const watchedTitle = watch("title");
    const watchedDescription = watch("description");
    const watchedOrder = watch("order");
    const [debouncedTitle] = useDebounce(watchedTitle, 500);
    const [debouncedDescription] = useDebounce(watchedDescription, 500);
    const [debouncedOrder] = useDebounce(watchedOrder, 500);

    const lastSentValuesRef = useRef<ReportSectionUpdateRequest>({
        title: sectionReport.title ?? "",
        description: sectionReport.description ?? "",
        order: sectionReport.order,
    });

    useEffect(() => {
        const values = {
            title: debouncedTitle,
            description: debouncedDescription,
            order: debouncedOrder,
        };

        const result = schema.safeParse(values);
        if (result.success) {
            const lastSent = lastSentValuesRef.current;
            const hasChanged =
                JSON.stringify(lastSent) !== JSON.stringify(result.data);

            if (hasChanged) {
                lastSentValuesRef.current = result.data;
                onUpdate(sectionReport.id, result.data);
            }
        }
    }, [
        debouncedTitle,
        debouncedDescription,
        debouncedOrder,
        onUpdate,
        sectionReport.id,
    ]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Section</CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
                <div className="flex flex-col justify-evenly gap-2">
                    {sectionReport.order > 1 && (
                        <ArrowUp
                            className="cursor-pointer text-muted-foreground hover:text-primary"
                            onClick={() => {
                                const nextValue = sectionReport.order - 1;
                                const result = schema.safeParse({
                                    order: nextValue,
                                });
                                if (result.success) {
                                    onUpdate(sectionReport.id, result.data);
                                } else {
                                    toast.error(result.error.errors[0].message);
                                }
                            }}
                        />
                    )}
                    <ArrowDown
                        className="cursor-pointer text-muted-foreground hover:text-primary"
                        onClick={() => {
                            const nextValue = sectionReport.order + 1;
                            const result = schema.safeParse({
                                order: nextValue,
                            });
                            if (result.success) {
                                onUpdate(sectionReport.id, result.data);
                            } else {
                                toast.error(result.error.message);
                            }
                        }}
                    />
                </div>
                <div className="flex flex-col flex-grow-1 gap-2">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="title">Titre</Label>
                        <Input id="title" type="text" {...register("title")} />
                        <p className="text-red-500">{errors.title?.message}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            className="border rounded p-2 resize-none"
                            rows={4}
                            {...register("description")}
                        />
                        <p className="text-red-500">
                            {errors.description?.message}
                        </p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
                <Button onClick={() => onDelete(sectionReport.id)}>
                    Delete
                </Button>
            </CardFooter>
        </Card>
    );
};
