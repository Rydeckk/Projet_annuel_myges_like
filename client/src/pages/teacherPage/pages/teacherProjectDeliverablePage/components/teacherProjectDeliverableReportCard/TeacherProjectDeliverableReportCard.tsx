import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { ReportSection } from "@/types/ReportSection";
import { ProjectGroup } from "@/types/ProjectGroup";
import MDEditor from "@uiw/react-md-editor";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

type TeacherProjectDeliverableReportCardProps = {
    reportSection: ReportSection;
    projectGroup: ProjectGroup;
};

export const TeacherProjectDeliverableReportCard = ({
    reportSection,
    projectGroup,
}: TeacherProjectDeliverableReportCardProps) => {
    const report = reportSection.reports.find(
        (r) => r.projectGroupId === projectGroup.id,
    );

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>{reportSection.title}</CardTitle>
                        <CardDescription>
                            {reportSection.description ||
                                "No description provided."}
                        </CardDescription>
                    </div>
                    <Badge variant={report ? "default" : "secondary"}>
                        {report ? "Submitted" : "Not submitted"}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                {report ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>
                                Submitted by:{" "}
                                {report.createdBystudent?.user?.firstName}{" "}
                                {report.createdBystudent?.user?.lastName}
                            </span>
                            <span className="ml-auto">
                                Last updated:{" "}
                                {new Date(
                                    report.updatedAt,
                                ).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="border rounded-lg p-4">
                            <MDEditor.Markdown
                                source={report.content}
                                data-color-mode="light"
                                className="prose prose-sm max-w-none"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>No report submitted yet for this section.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
