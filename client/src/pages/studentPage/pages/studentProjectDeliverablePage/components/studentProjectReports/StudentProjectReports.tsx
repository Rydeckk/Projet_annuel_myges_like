import { StudentPromotionProjectContext } from "@/pages/studentPage/contexts/StudentPromotionProjectContext";
import { useContext } from "react";
import { StudentProjectDeliverableReportCard } from "../studentProjectDeliverableReportCard/StudentProjectDeliverableReportCard";

export const StudentProjectReports = () => {
    const { promotionProject } = useContext(StudentPromotionProjectContext);

    const reportSections = promotionProject?.reportSections ?? [];

    return (
        <div className="flex flex-col gap-4 mt-10">
            {reportSections.map((reportSection) => (
                <StudentProjectDeliverableReportCard
                    key={reportSection.id}
                    reportSection={reportSection}
                />
            ))}
        </div>
    );
};
