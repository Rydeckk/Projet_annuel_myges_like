import { TableAction } from "@/components/table/TableAction";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useMemo, useState } from "react";
import { PromotionStudentForm } from "../forms/PromotionStudentForm";
import { UserService } from "@/services/userService/UserService";
import { PromotionStudentRequest } from "@/types/Promotion";
import { toast } from "sonner";
import { ApiException } from "@/services/api/ApiException";
import { User } from "@/types/User";

type Props = {
    user: User;
    getPromotion: () => Promise<void>;
};

export const PromotionStudentActionCell = ({ user, getPromotion }: Props) => {
    const userService = useMemo(() => new UserService(), []);

    const [editOpen, setEditOpen] = useState(false);

    const onStudentUpdate = async (
        userId: string,
        data: Omit<PromotionStudentRequest, "promotionId">,
    ) => {
        try {
            await userService.update(userId, data);
            getPromotion();
            setEditOpen(false);
            toast.success("The student was successfully updated");
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    };

    const onDeleteStudent = async (userId: string) => {
        try {
            await userService.delete(userId);
            getPromotion();
            toast.success("The student was successfully deleted");
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    };

    return (
        <>
            <TableAction
                onEditClick={() => setEditOpen(true)}
                onDeleteClick={() => onDeleteStudent(user.id)}
            />
            <Sheet open={editOpen} onOpenChange={setEditOpen}>
                <SheetContent className="p-4">
                    <SheetHeader>
                        <SheetTitle>Update student</SheetTitle>
                    </SheetHeader>
                    <PromotionStudentForm
                        onSubmit={(data) => onStudentUpdate(user.id, data)}
                        studentUserData={user}
                    />
                </SheetContent>
            </Sheet>
        </>
    );
};
