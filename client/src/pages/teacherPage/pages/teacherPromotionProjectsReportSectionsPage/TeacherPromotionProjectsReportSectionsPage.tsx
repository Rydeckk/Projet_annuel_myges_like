import {
    ReportSection,
    ReportSectionRequest,
    ReportSectionUpdateRequest,
} from "@/types/ReportSection";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { TeacherPromotionDetailContext } from "../../contexts/TeacherPromotionDetailContext";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { CirclePlus } from "lucide-react";
import { ApiException } from "@/services/api/ApiException";
import { TeacherPromotionProjectsReportSectionsCard } from "./components/TeacherPromotionProjectsReportSectionsCard/TeacherPromotionProjectsReportSectionsCard";
import { TeacherPromotionProjectsReportSectionsForm } from "./components/forms/TeacherPromotionProjectsReportSectionsForm";
import { toast } from "sonner";
import { ReportSectionsService } from "@/services/reportSectionsService/ReportSectionsService";
import { useParams } from "react-router";

export const TeacherPromotionProjectsReportSectionsPage = () => {
    const { projectName } = useParams();
    const { promotion } = useContext(TeacherPromotionDetailContext);
    const [reportSections, setReportSections] = useState<ReportSection[]>([]);
    const reportSectionsService = useMemo(
        () => new ReportSectionsService(),
        [],
    );

    const [open, setOpen] = useState(false);

    const getReportSections = useCallback(async () => {
        if (!promotion) return;
        try {
            const promotionProjectId = promotion.promotionProjects?.find(
                (promotionProject) =>
                    promotionProject.project?.name === projectName,
            )?.id;
            if (!promotionProjectId) {
                toast.error("Project not found in promotion");
                return;
            }
            const sections =
                await reportSectionsService.findAll(promotionProjectId);
            setReportSections(sections);
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    }, [projectName, promotion, reportSectionsService]);

    useEffect(() => {
        getReportSections();
    }, [getReportSections]);

    const onCreateReportSection = async (data: ReportSectionRequest) => {
        try {
            const reportSectionCreated =
                await reportSectionsService.create(data);
            setReportSections((reportSections) => [
                ...reportSections,
                reportSectionCreated,
            ]);
            setOpen(false);
            toast.success("The project was successfully created");
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    };

    const handleUpdate = async (
        id: string,
        updatedSection: ReportSectionUpdateRequest,
    ) => {
        try {
            await reportSectionsService.update(id, updatedSection);
            await getReportSections();
            toast.success("Section updated successfully");
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await reportSectionsService.delete(id);
            await getReportSections();
            toast.success("Section deleted successfully");
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between py-4">
                <h1 className="text-2xl font-bold">
                    Report Section Management
                </h1>
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger>
                        <Button className="ml-auto" variant="outline">
                            <CirclePlus />
                            Create Section
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="p-4">
                        <SheetHeader>
                            <SheetTitle>Create Section</SheetTitle>
                            <TeacherPromotionProjectsReportSectionsForm
                                onSubmit={onCreateReportSection}
                            />
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>
            <div className="grid gap-4 mt-6">
                {reportSections.map((reportSection) => (
                    <TeacherPromotionProjectsReportSectionsCard
                        key={reportSection.id}
                        sectionReport={reportSection}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    );
};
