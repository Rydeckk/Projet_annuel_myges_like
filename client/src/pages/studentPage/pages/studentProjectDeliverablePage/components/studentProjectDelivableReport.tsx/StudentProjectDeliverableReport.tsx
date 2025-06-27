import { StudentPromotionProjectContext } from "@/pages/studentPage/contexts/StudentPromotionProjectContext";
import { ApiException } from "@/services/api/ApiException";
import { ReportSectionsService } from "@/services/reportSectionsService/ReportSectionsService";
import { ReportSection } from "@/types/ReportSection";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { StudentProjectDeliverableReportCard } from "../studentProjectDeliverableReportCard/StudentProjectDeliverableReportCard";
import { Report } from "@/types/Report";
import { ReportService } from "@/services/reportService/ReportService";

export const StudentProjectDeliverableReport = () => {
    const { promotionProject, studentProjectGroup } = useContext(
        StudentPromotionProjectContext,
    );
    const reportSectionsService = useMemo(
        () => new ReportSectionsService(),
        [],
    );
    const reportService = useMemo(() => new ReportService(), []);
    const [reportSections, setReportSections] = useState<ReportSection[]>([]);
    const [reports, setReports] = useState<Report[]>([]);

    const getReportSections = useCallback(async () => {
        if (!promotionProject) return;
        try {
            const sections = await reportSectionsService.findAll(
                promotionProject.id,
            );
            setReportSections(sections);
            const reports = sections.flatMap((sectionReport) =>
                sectionReport.reports.filter(
                    (report) =>
                        report.projectGroupId === studentProjectGroup?.id,
                ),
            );
            setReports(reports);
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    }, [promotionProject, reportSectionsService, studentProjectGroup?.id]);

    useEffect(() => {
        getReportSections();
    }, [getReportSections]);

    const handleSave = async (
        content: string,
        reportSection: ReportSection,
        report?: Report,
    ) => {
        if (!studentProjectGroup) {
            toast.error("You must be in a project group to create a report");
            return;
        }

        if (report) {
            await reportService.update(report.id, {
                content,
            });
            toast.success("Report updated successfully");
        } else {
            await reportService.create({
                content,
                projectGroupId: studentProjectGroup.id,
                reportSectionId: reportSection.id,
            });
            toast.success("Report created successfully");
        }
        getReportSections();
    };

    return (
        <div className="flex flex-col gap-4 mt-10">
            {reportSections.map((reportSection) => (
                <StudentProjectDeliverableReportCard
                    key={reportSection.id}
                    reportSection={reportSection}
                    onSave={handleSave}
                    report={reports.find(
                        (report) => report.reportSectionId === reportSection.id,
                    )}
                />
            ))}
        </div>
    );
};
