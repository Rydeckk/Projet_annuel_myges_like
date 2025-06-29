import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Report } from "@/types/Report";
import { TeacherPromotionDetailContext } from "../../contexts/PromotionDetailContext";
import { ReportService } from "@/services/reportService/ReportService";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ReportSection } from "@/types/ReportSection";
import { TeacherPromotionReportsCard } from "./components/teacherPromotionReportsCard/TeacherPromotionReportsCard";

export const TeacherPromotionReportsPage = () => {
    const { promotion } = useContext(TeacherPromotionDetailContext);
    const reportService = useMemo(() => new ReportService(), []);
    const [reports, setReports] = useState<Report[]>([]);
    const [reportSections, setReportSections] = useState<ReportSection[]>([]);
    const [selectedPromotionProject, setSelectedPromotionProject] = useState<
        string | null
    >(null);
    const [selectedSectionReport, setSelectedSectionReport] = useState<
        string | null
    >(null);

    const filteredReports = useMemo(() => {
        const seenGroupIds = new Set<string>();

        if (selectedSectionReport) {
            return reports.filter(
                (report) => report.reportSectionId === selectedSectionReport,
            );
        }

        if (selectedPromotionProject) {
            return reports.filter((report) => {
                const isSameProject =
                    report.reportSection?.promotionProjectId ===
                    selectedPromotionProject;

                if (!isSameProject) return false;
                if (seenGroupIds.has(report.projectGroupId)) return false;

                seenGroupIds.add(report.projectGroupId);
                return true;
            });
        }

        return reports.filter((report) => {
            if (seenGroupIds.has(report.projectGroupId)) return false;
            seenGroupIds.add(report.projectGroupId);
            return true;
        });
    }, [reports, selectedPromotionProject, selectedSectionReport]);

    const getReports = useCallback(async () => {
        if (promotion) {
            const reports = await reportService.getReportsByPromotionId(
                promotion.id,
            );
            setReports(reports);
        }
    }, [promotion, reportService]);

    useEffect(() => {
        if (promotion) {
            getReports();
        }
    }, [getReports, promotion]);

    useEffect(() => {
        if (selectedPromotionProject) {
            const sections = promotion?.promotionProjects?.find(
                (promotionProject) =>
                    promotionProject.id === selectedPromotionProject,
            )?.reportSections;
            setReportSections(sections || []);
        } else {
            setReportSections([]);
        }
    }, [selectedPromotionProject, promotion]);

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Promotion Reports</h1>
            <div className="flex gap-4">
                <Select
                    value={selectedPromotionProject ?? "all"}
                    onValueChange={(value) =>
                        setSelectedPromotionProject(
                            value === "all" ? null : value,
                        )
                    }
                >
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Projects</SelectItem>
                        {promotion?.promotionProjects?.map(
                            (promotionProject) => (
                                <SelectItem
                                    key={promotionProject.id}
                                    value={promotionProject.id}
                                >
                                    {promotionProject.project?.name}
                                </SelectItem>
                            ),
                        )}
                    </SelectContent>
                </Select>
                <Select
                    value={selectedSectionReport ?? "all"}
                    onValueChange={(value) =>
                        setSelectedSectionReport(value === "all" ? null : value)
                    }
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Sections" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Sections</SelectItem>
                        {reportSections.map((section) => (
                            <SelectItem key={section.id} value={section.id}>
                                {section.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex gap-4 mt-6 flex-wrap">
                {filteredReports.map((report) => (
                    <TeacherPromotionReportsCard
                        key={report.id}
                        projectName={
                            report.reportSection.promotionProject.project
                                ?.name ?? ""
                        }
                        projectGroup={report.projectGroup}
                        reportSection={
                            report.reportSection.id === selectedSectionReport
                                ? report.reportSection
                                : undefined
                        }
                    />
                ))}
            </div>
        </div>
    );
};
