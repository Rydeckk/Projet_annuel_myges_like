import { TeacherPromotionDetailContext } from "@/pages/teacherPage/contexts/PromotionDetailContext";
import { ReportService } from "@/services/reportService/ReportService";
import MDEditor from "@uiw/react-md-editor";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";

export const TeacherPromotionReportsView = () => {
    const { promotion } = useContext(TeacherPromotionDetailContext);
    const { projectName, groupName, sectionReportName } = useParams();
    const reportService = useMemo(() => new ReportService(), []);
    const [content, setContent] = useState<string>("");

    const getReportsContent = useCallback(async () => {
        if (promotion && projectName && groupName) {
            const content =
                await reportService.getReportContentByPromotionAndProjectAndGroup(
                    promotion.id,
                    projectName,
                    groupName,
                    sectionReportName ?? null,
                );
            setContent(content.content);
        }
    }, [promotion, projectName, groupName, reportService, sectionReportName]);

    useEffect(() => {
        getReportsContent();
    }, [getReportsContent]);

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Report View</h1>
            <div data-color-mode="light" className="flex flex-col gap-4">
                <MDEditor.Markdown
                    source={content}
                    className="min-h-[300px] w-full border rounded p-8"
                />
            </div>
        </div>
    );
};
