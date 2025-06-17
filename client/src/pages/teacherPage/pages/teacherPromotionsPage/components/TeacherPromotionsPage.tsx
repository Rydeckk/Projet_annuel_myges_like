import { PromotionContext } from "@/contexts/PromotionContext";
import { ApiException } from "@/services/api/ApiException";
import { PromotionService } from "@/services/promotionService/PromotionService";
import { Promotion, PromotionRequest } from "@/types/Promotion";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { PromotionActionCell } from "./promotionActionCell/PromotionActionCell";
import { Table } from "@/components/table/Table";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { PromotionForm } from "./forms/PromotionForm";

export const TeacherPromotionsPage = () => {
    const { promotions, getPromotions } = useContext(PromotionContext);

    const promotionService = useMemo(() => new PromotionService(), []);
    const [open, setOpen] = useState(false);

    const onCreatePromotion = async (data: PromotionRequest) => {
        try {
            await promotionService.create(data);
            getPromotions();
            setOpen(false);
            toast.success("The promotion was successfully created");
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    };

    const columns: ColumnDef<Promotion>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => (
                <Link to={row.getValue("name")}>{row.getValue("name")}</Link>
            ),
        },
        {
            accessorKey: "startDate",
            header: "Start date",
            cell: ({ row }) => (
                <p>
                    {format(new Date(row.getValue("startDate")), "dd/MM/yyyy")}
                </p>
            ),
        },
        {
            accessorKey: "endDate",
            header: "End date",
            cell: ({ row }) => (
                <p>{format(new Date(row.getValue("endDate")), "dd/MM/yyyy")}</p>
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <PromotionActionCell
                    key={row.original.id}
                    promotion={row.original}
                    getPromotions={getPromotions}
                />
            ),
        },
    ];

    useEffect(() => {
        getPromotions();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold">Promotions management</h1>
            <Table
                data={promotions}
                columns={columns}
                tableHeader={
                    <Button
                        className="ml-auto"
                        variant="outline"
                        onClick={() => setOpen(true)}
                    >
                        <CirclePlus />
                        Create promotion
                    </Button>
                }
            />
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent className="p-4">
                    <SheetHeader>
                        <SheetTitle>Create promotion</SheetTitle>
                    </SheetHeader>
                    <PromotionForm onSubmit={onCreatePromotion} />
                </SheetContent>
            </Sheet>
        </div>
    );
};
