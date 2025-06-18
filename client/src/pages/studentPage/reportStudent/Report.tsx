import { useEffect, useMemo, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Report, ReportRequest } from "@/types/Report";
import { ReportService } from "@/services/reportService/ReportService";
import { ApiException } from "@/services/api/ApiException";
import { toast } from "sonner";

type ReportProps = {
    report: Report;
};

export const ReportPage = (props: ReportProps) => {
    const [content, setContent] = useState<string | undefined>("");
    console.log(content);
    const reportService = useMemo(() => new ReportService(), []);
    const [report, setReport] = useState<Report>(props.report);

    useEffect(() => {
        if (props.report) {
            setReport(props.report);
            setContent(props.report.content || "");
        }
    }, [props.report]);

    const onSaveReport = async (data: ReportRequest) => {
        try {
            if (report) {
                await reportService.update(report.id, data);
                toast.success("The report was successfully updated");
                return;
            }
            await reportService.create(data);
            toast.success("The report was successfully saved");
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    };

    return (
        <div data-color-mode="light">
            <MDEditor value={content} onChange={setContent} />
            <Button
                className="ml-auto"
                variant="outline"
                onClick={() =>
                    onSaveReport({
                        content: content || "",
                        projectGroupId: report.projetGroup.id,
                    })
                }
            >
                Save Report
            </Button>
        </div>
    );
};
