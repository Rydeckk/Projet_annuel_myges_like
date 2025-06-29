import { Card, CardContent } from "./card";
import { UserWithDetails } from "@/services/authService/AuthService";
import { USER_ROLE } from "@/enums/UserRole";
import { cn } from "@/utils/utils";

interface UserCardProps {
    user: UserWithDetails;
    className?: string;
}

const UserCard = ({ user, className }: UserCardProps) => {
    const isTeacher = user.user.role === USER_ROLE.TEACHER;
    const iconLetter = isTeacher ? "T" : "S";

    return (
        <Card className={cn("p-0 py-2", className)}>
            <CardContent className="flex items-center gap-3 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-800 font-semibold">
                    {iconLetter}
                </div>
                <div className="flex flex-col">
                    <div className="font-medium text-sm">
                        {user.user.firstName} {user.user.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                        {user.user.role.toLowerCase()}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export { UserCard };
