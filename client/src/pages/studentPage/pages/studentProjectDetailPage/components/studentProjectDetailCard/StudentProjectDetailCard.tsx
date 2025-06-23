import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
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
        <Card>
            <CardHeader>
                <CardTitle>{promotionProject.project?.name}</CardTitle>
                <CardDescription className="text-ellipsis line-clamp-4">
                    {promotionProject.project?.description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div>
                    <p>Group Name: {projectGroup.name}</p>
                    <p>
                        Group Members:{" "}
                        {(projectGroup?.projectGroupStudents ?? []).map(
                            ({ student }) =>
                                `${student?.user?.firstName} ${student?.user?.lastName}`,
                        )}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};
