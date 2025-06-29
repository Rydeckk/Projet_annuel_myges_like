import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export const TeacherPromotionProjectDetailPage = () => {
    return (
        <div className="flex flex-col gap-4">
            <Button asChild>
                <Link to="groups">Groups</Link>
            </Button>
        </div>
    );
};
