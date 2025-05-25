import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { Table } from "@/components/table/Table";
import { useEffect, useMemo, useState } from "react";
import { PromotionService } from "@/services/promotionService/PromotionService";
import { Promotion, PromotionRequest } from "@/types/Promotion";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { ApiException } from "@/services/api/ApiException";
import { toast } from "sonner";
import { format } from "date-fns";
import { Link } from "react-router";
import { PromotionForm } from "../forms/PromotionForm";
import { TableAction } from "@/components/table/TableAction";

export const Promotions = () => {
    const promotionService = useMemo(() => new PromotionService(), []);

    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const getPromotions = async () => {
        const promotionsData = await promotionService.findAll();
        setPromotions(promotionsData as Promotion[]);
    };

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
            cell: ({ row }) => {
                const promotionId = row.original.id;
                return (
                    <>
                        <TableAction
                            onDeleteClick={() => onDeletePromotion(promotionId)}
                            onEditClick={() => setEditOpen(true)}
                        />
                        <Sheet open={editOpen} onOpenChange={setEditOpen}>
                            <SheetContent className="p-4">
                                <SheetHeader>
                                    <SheetTitle>Update promotion</SheetTitle>
                                </SheetHeader>
                                <PromotionForm
                                    onSubmit={(data) =>
                                        onUpdatePromotion(promotionId, data)
                                    }
                                    promotionData={row.original}
                                />
                            </SheetContent>
                        </Sheet>
                    </>
                );
            },
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
