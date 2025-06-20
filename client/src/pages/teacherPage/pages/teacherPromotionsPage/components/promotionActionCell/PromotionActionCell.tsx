import { TableAction } from "@/components/table/TableAction";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useMemo, useState } from "react";
import { PromotionForm } from "../forms/PromotionForm";
import { Promotion, PromotionRequest } from "@/types/Promotion";
import { PromotionService } from "@/services/promotionService/PromotionService";
import { toast } from "sonner";
import { ApiException } from "@/services/api/ApiException";

type Props = {
    promotion: Promotion;
    getPromotions: () => Promise<void>;
};

export const PromotionActionCell = ({ promotion, getPromotions }: Props) => {
    const promotionService = useMemo(() => new PromotionService(), []);

    const [editOpen, setEditOpen] = useState(false);

    const onUpdatePromotion = async (
        promotionId: string,
        data: PromotionRequest,
    ) => {
        try {
            await promotionService.update({ promotionId, data });
            getPromotions();
            setEditOpen(false);
            toast.success("The promotion was successfully modified");
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    };

    const onDeletePromotion = async (promotionId: string) => {
        try {
            await promotionService.delete(promotionId);
            getPromotions();
            toast.success("The promotion was successfully deleted");
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    };

    return (
        <>
            <TableAction
                onDeleteClick={() => onDeletePromotion(promotion.id)}
                onEditClick={() => setEditOpen(true)}
            />
            <Sheet open={editOpen} onOpenChange={setEditOpen}>
                <SheetContent className="p-4">
                    <SheetHeader>
                        <SheetTitle>Update promotion</SheetTitle>
                    </SheetHeader>
                    <PromotionForm
                        onSubmit={(data) =>
                            onUpdatePromotion(promotion.id, data)
                        }
                        promotionData={promotion}
                    />
                </SheetContent>
            </Sheet>
        </>
    );
};
