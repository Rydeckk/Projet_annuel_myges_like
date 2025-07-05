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
import { useContext, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDebouncedCallback } from "use-debounce";
import { ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ReportSectionsService } from "@/services/reportSectionsService/ReportSectionsService";
import { TeacherPromotionProjectDetailContext } from "@/pages/teacherPage/contexts/TeacherPromotionProjectDetailContext";
import { ApiException } from "@/services/api/ApiException";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
    title: z.string().nonempty().optional(),
    description: z.string().optional(),
    order: z.number().optional(),
    promotionProjectId: z.string().uuid(),
});

type TeacherPromotionProjectsReportSectionsCardProps = {
    sectionReport: ReportSection;
};

export const TeacherPromotionProjectsReportSectionsCard = ({
    sectionReport,
}: TeacherPromotionProjectsReportSectionsCardProps) => {
    const { promotionProject, getPromotionProject } = useContext(
        TeacherPromotionProjectDetailContext,
    );

    const {
        register,
        formState: { errors },
    } = useForm<ReportSectionUpdateRequest>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: sectionReport.title,
            description: sectionReport.description,
            order: sectionReport.order,
            promotionProjectId: sectionReport.promotionProjectId,
        },
    });

    const reportSectionsService = useMemo(
        () => new ReportSectionsService(),
        [],
    );

    const reportSections = promotionProject?.reportSections ?? [];

    const onUpdateDebounced = useDebouncedCallback(
        async (id: string, updatedSection: ReportSectionUpdateRequest) => {
            try {
                await reportSectionsService.update(id, updatedSection);
                getPromotionProject();
                toast.success("Section updated successfully");
            } catch (error) {
                if (error instanceof ApiException) {
                    toast.error(error.message);
                }
            }
        },
        250,
    );

    const onReportSectionUpdateChange = async (
        key: keyof Omit<ReportSectionUpdateRequest, "order">,
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        await onUpdateDebounced(sectionReport.id, {
            ...sectionReport,
            [key]: e.target.value,
        });
    };

    const onUpdateOrder = async (
        updatedSection: ReportSectionUpdateRequest,
    ) => {
        try {
            await reportSectionsService.update(
                sectionReport.id,
                updatedSection,
            );
            await getPromotionProject();
            toast.success("Section updated successfully");
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    };

    const onDelete = async (id: string) => {
        try {
            await reportSectionsService.delete(
                id,
                sectionReport.promotionProjectId,
            );
            await getPromotionProject();
            toast.success("Section deleted successfully");
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Section</CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
                <div className="flex flex-col justify-evenly gap-2">
                    {sectionReport.order > 1 && (
                        <Button
                            onClick={() =>
                                onUpdateOrder({
                                    ...sectionReport,
                                    order: sectionReport.order - 1,
                                })
                            }
                        >
                            <ArrowUp />
                        </Button>
                    )}
                    {reportSections.length !== sectionReport.order && (
                        <Button
                            onClick={() =>
                                onUpdateOrder({
                                    ...sectionReport,
                                    order: sectionReport.order + 1,
                                })
                            }
                        >
                            <ArrowDown />
                        </Button>
                    )}
                </div>
                <div className="flex flex-col flex-grow-1 gap-2">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="title">Titre</Label>
                        <Input
                            id="title"
                            type="text"
                            {...register("title")}
                            onChange={(e) =>
                                onReportSectionUpdateChange("title", e)
                            }
                        />
                        <p className="text-red-500">{errors.title?.message}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            className="border rounded p-2 resize-none"
                            rows={4}
                            {...register("description")}
                            onChange={(e) =>
                                onReportSectionUpdateChange("description", e)
                            }
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
