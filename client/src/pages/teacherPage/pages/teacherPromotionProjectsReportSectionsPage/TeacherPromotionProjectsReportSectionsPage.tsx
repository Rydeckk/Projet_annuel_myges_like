import { ReportSectionRequest } from "@/types/ReportSection";
import { useContext, useMemo, useState } from "react";
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
import { TeacherPromotionProjectDetailContext } from "../../contexts/TeacherPromotionProjectDetailContext";

export const TeacherPromotionProjectsReportSectionsPage = () => {
    const { promotionProject, getPromotionProject } = useContext(
        TeacherPromotionProjectDetailContext,
    );

    const reportSectionsService = useMemo(
        () => new ReportSectionsService(),
        [],
    );

    const [open, setOpen] = useState(false);

    const onCreateReportSection = async (data: ReportSectionRequest) => {
        try {
            await reportSectionsService.create(data);
            await getPromotionProject();
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
                {(promotionProject?.reportSections ?? []).map(
                    (reportSection) => (
                        <TeacherPromotionProjectsReportSectionsCard
                            key={reportSection.id}
                            sectionReport={reportSection}
                        />
                    ),
                )}
            </div>
        </div>
    );
};
