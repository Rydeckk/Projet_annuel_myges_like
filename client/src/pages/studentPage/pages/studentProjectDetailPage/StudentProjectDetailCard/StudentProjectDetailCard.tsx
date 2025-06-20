import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { ProjectGroup } from "@/types/ProjectGroup";
import { PromotionProject } from "@/types/PromotionProject";

type StudentProjectDetailCardProps = {
    projectGroup: ProjectGroup;
    promotionProject: PromotionProject;
};

export const StudentProjectDetailCard = ({
    projectGroup,
    promotionProject,
}: StudentProjectDetailCardProps) => {
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Project Detail</CardTitle>
                    <CardDescription className="text-ellipsis line-clamp-4"></CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Project Name: {promotionProject?.project?.name}</p>
                    <p>
                        Project Description:{" "}
                        {promotionProject?.project?.description}
                    </p>
                    {projectGroup && (
                        <div>
                            <p>Group Name: {projectGroup?.name}</p>
                            <p>
                                Group Members:{" "}
                                {projectGroup?.projectGroupStudents &&
                                    projectGroup.projectGroupStudents.map(
                                        (s) =>
                                            s.student?.user?.firstName +
                                            " " +
                                            s.student?.user?.lastName.toLocaleUpperCase() +
                                            " ",
                                    )}
                            </p>
                        </div>
                    )}
                    {!projectGroup && (
                        <p>You are not part of a group for this project.</p>
                    )}
                </CardContent>
                <CardFooter className="flex gap-4"></CardFooter>
            </Card>
        </>
    );
};
