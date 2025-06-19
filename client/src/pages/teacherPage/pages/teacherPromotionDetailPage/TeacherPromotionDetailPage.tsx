import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export const TeacherPromotionDetailPage = () => {
    return (
        <div className="flex flex-col gap-4">
            <Button asChild>
                <Link to="students">Promotion Students</Link>
            </Button>
            <Button asChild>
                <Link to="projects">Promotion Projects</Link>
            </Button>
        </div>
    );
};
