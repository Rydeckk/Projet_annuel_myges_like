import { TeacherPromotionProjectDetailContext } from "@/pages/teacherPage/contexts/TeacherPromotionProjectDetailContext";
import { ApiException } from "@/services/api/ApiException";
import { ReportSectionsService } from "@/services/reportSectionsService/ReportSectionsService";
import { ReportSection } from "@/types/ReportSection";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { TeacherProjectDeliverableReportCard } from "../teacherProjectDeliverableReportCard/TeacherProjectDeliverableReportCard";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ProjectGroup } from "@/types/ProjectGroup";

export const TeacherProjectDeliverableReport = () => {
    const { promotionProject, projectGroups } = useContext(
        TeacherPromotionProjectDetailContext,
    );
    const reportSectionsService = useMemo(
        () => new ReportSectionsService(),
        [],
    );
    const [reportSections, setReportSections] = useState<ReportSection[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<ProjectGroup | null>(
        null,
    );

    const getReportSections = useCallback(async () => {
        if (!promotionProject) return;
        try {
            const sections = await reportSectionsService.findAll(
                promotionProject.id,
            );
            setReportSections(sections);
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    }, [promotionProject, reportSectionsService]);

    useEffect(() => {
        getReportSections();
    }, [getReportSections]);

    // Set first group as default when groups are loaded
    useEffect(() => {
        if (projectGroups.length > 0 && !selectedGroup) {
            setSelectedGroup(projectGroups[0]);
        }
    }, [projectGroups, selectedGroup]);

    const filteredReports = useMemo(() => {
        if (!selectedGroup) return [];

        return reportSections.map((section) => ({
            ...section,
            reports: section.reports.filter(
                (report) => report.projectGroupId === selectedGroup.id,
            ),
        }));
    }, [reportSections, selectedGroup]);

    return (
        <div className="flex flex-col gap-4 mt-10">
            <div className="flex items-center gap-4 mb-4">
                <label className="text-sm font-medium">
                    Select Project Group:
                </label>
                <Select
                    value={selectedGroup?.id}
                    onValueChange={(value) => {
                        const group = projectGroups.find((g) => g.id === value);
                        setSelectedGroup(group || null);
                    }}
                >
                    <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Select a project group" />
                    </SelectTrigger>
                    <SelectContent>
                        {projectGroups.map((group) => (
                            <SelectItem key={group.id} value={group.id}>
                                {group.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {selectedGroup && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                        Reports for {selectedGroup.name}
                    </h3>
                    {filteredReports.map((reportSection) => (
                        <TeacherProjectDeliverableReportCard
                            key={reportSection.id}
                            reportSection={reportSection}
                            projectGroup={selectedGroup}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
