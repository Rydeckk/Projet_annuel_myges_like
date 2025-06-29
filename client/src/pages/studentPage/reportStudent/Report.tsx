import { useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Report, ReportRequest } from "@/types/Report";
import { ApiException } from "@/services/api/ApiException";
import { toast } from "sonner";

type ReportProps = {
    existingReport: Report;
    onSubmit: (data: ReportRequest) => Promise<void>;
};

export const ReportPage = ({ existingReport, onSubmit }: ReportProps) => {
    const [report, setReport] = useState<Report>(existingReport);
    const [content, setContent] = useState<string>("");

    useEffect(() => {
        if (report) {
            setReport(report);
            setContent(report.content || "");
        }
    }, [report]);

    const onSaveReport = async (data: ReportRequest) => {
        try {
            await onSubmit(data);
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    };

    return (
        <div data-color-mode="light">
            <MDEditor
                value={content}
                onChange={(value) => setContent(value || "")}
            />
            <Button
                className="ml-auto"
                variant="outline"
                onClick={() =>
                    onSaveReport({
                        content: content || "",
                        projectGroupId: report.projetGroupId,
                    })
                }
            >
                Save Report
            </Button>
        </div>
    );
};
