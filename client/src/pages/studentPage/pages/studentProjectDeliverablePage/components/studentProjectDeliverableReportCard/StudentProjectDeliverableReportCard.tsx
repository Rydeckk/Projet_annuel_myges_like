import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { ReportSection } from "@/types/ReportSection";
import MDEditor from "@uiw/react-md-editor";
import { useContext, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { StudentPromotionProjectContext } from "@/pages/studentPage/contexts/StudentPromotionProjectContext";
import { toast } from "sonner";
import { ReportService } from "@/services/reportService/ReportService";
import { ApiException } from "@/services/api/ApiException";

type StudentProjectDeliverableReportCardProps = {
    reportSection: ReportSection;
};

export const StudentProjectDeliverableReportCard = ({
    reportSection,
}: StudentProjectDeliverableReportCardProps) => {
    const {
        studentProjectGroup,
        studentProjectGroupReports,
        getPromotionProject,
    } = useContext(StudentPromotionProjectContext);

    const report = studentProjectGroupReports.find(
        (report) => report.reportSectionId === reportSection.id,
    );

    const reportService = useMemo(() => new ReportService(), []);

    const [content, setContent] = useState(report?.content ?? "");

    const onUpdateDebounced = useDebouncedCallback(async (content: string) => {
        try {
            await reportService.upsert({
                content,
                projectGroupId: studentProjectGroup!.id,
                reportSectionId: reportSection.id,
            });
            toast.success(
                `Report ${report ? "updated" : "created"} successfully`,
            );
            getPromotionProject();
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    }, 250);

    const onContentChange = async (content: string = "") => {
        if (!studentProjectGroup) {
            toast.error("You must be in a project group to create a report");
            return;
        }
        setContent(content);
        await onUpdateDebounced(content);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{reportSection.title}</CardTitle>
                <CardDescription>
                    {reportSection.description || "No description provided."}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
                <div className="flex flex-col flex-grow-1 gap-2">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <MDEditor
                                data-color-mode="light"
                                id="content"
                                value={content}
                                onChange={onContentChange}
                                className="min-h-[300px] w-full border rounded p-2"
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
