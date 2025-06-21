import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { PromotionProject } from "@/types/PromotionProject";
import { Link } from "react-router";

type StudentProjectProps = {
    promotionProject: PromotionProject;
};

export const StudentProjectCard = ({
    promotionProject,
}: StudentProjectProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{promotionProject.project?.name}</CardTitle>
                <CardDescription className="text-ellipsis line-clamp-4"></CardDescription>
            </CardHeader>
            <CardContent>{promotionProject.project?.description}</CardContent>
            <CardFooter className="flex gap-4">
                <Button>
                    <Link to={`${promotionProject.project?.name}/groups`}>
                        View Groups
                    </Link>
                </Button>
                <Button>
                    <Link to={`${promotionProject.project?.name}`}>
                        View Project
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
};
