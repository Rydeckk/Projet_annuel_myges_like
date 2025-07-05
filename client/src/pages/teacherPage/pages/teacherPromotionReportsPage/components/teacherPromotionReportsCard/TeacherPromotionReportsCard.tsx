import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import {
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ProjectGroup } from "@/types/ProjectGroup";
import { ReportSection } from "@/types/ReportSection";
import { Tooltip } from "@radix-ui/react-tooltip";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router";

type TeacherPromotionReportsCardProps = {
    projectName: string;
    projectGroup: ProjectGroup;
    reportSection?: ReportSection;
};

export const TeacherPromotionReportsCard = ({
    projectName,
    projectGroup,
    reportSection,
}: TeacherPromotionReportsCardProps) => {
    return (
        <Card className="w-[23rem]">
            <CardHeader>
                <div className="w-full flex justify-between items-center">
                    <CardTitle>{projectName}</CardTitle>
                    <div className="flex gap-4">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="h-8 w-8"
                                        asChild
                                    >
                                        <Link
                                            to={
                                                reportSection
                                                    ? `${projectName}/${projectGroup.name}/${reportSection.title}`
                                                    : `${projectName}/${projectGroup.name}`
                                            }
                                        >
                                            <ExternalLink className="h-2 w-2" />
                                        </Link>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>View report</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-2 my-2">
                    <p>{`Group name : ${projectGroup.name}`}</p>
                    <p>Group Members : </p>
                    {projectGroup.projectGroupStudents?.map((groupStudent) => (
                        <p key={groupStudent.student?.id}>
                            - {groupStudent.student?.user?.lastName}{" "}
                            {groupStudent.student?.user?.firstName}
                        </p>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
