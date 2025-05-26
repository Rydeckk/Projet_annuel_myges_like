import { Table } from "@/components/table/Table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { ApiException } from "@/services/api/ApiException";
import { PromotionService } from "@/services/promotionService/PromotionService";
import { UserService } from "@/services/userService/UserService";
import { Promotion, PromotionStudentRequest } from "@/types/Promotion";
import { User } from "@/types/User";
import { ColumnDef } from "@tanstack/react-table";
import { CirclePlus } from "lucide-react";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { TableAction } from "@/components/table/TableAction";
import { PromotionStudentForm } from "../forms/PromotionStudentForm";

export const PromotionDetail = () => {
    const { promotionName } = useParams();

    const promotionService = useMemo(() => new PromotionService(), []);
    const userService = useMemo(() => new UserService(), []);

    const [promotion, setPromotion] = useState<Promotion | null>(null);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [importOpen, setImportOpen] = useState(false);
    const [importFile, setImportFile] =
        useState<ChangeEvent<HTMLInputElement> | null>(null);

    const getPromotion = async () => {
        try {
            const promotionData =
                await promotionService.findByName(promotionName);
            setPromotion(promotionData);
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    };

    const onAddStudentToPromotion = async (
        data: Omit<PromotionStudentRequest, "promotionId">,
    ) => {
        if (!promotion) return;
        try {
            await promotionService.createPromotionStudents([
                {
                    ...data,
                    promotionId: promotion.id,
                },
            ]);
            getPromotion();
            setOpen(false);
            toast.success("The student was successfully created");
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    };

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

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => <p>{row.getValue("email")}</p>,
        },
        {
            accessorKey: "firstName",
            header: "First name",
            cell: ({ row }) => <p>{row.getValue("firstName")}</p>,
        },
        {
            accessorKey: "lastName",
            header: "Last name",
            cell: ({ row }) => <p>{row.getValue("lastName")}</p>,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const userId = row.original.id;

                return (
                    <>
                        <TableAction
                            onEditClick={() => setEditOpen(true)}
                            onDeleteClick={() => onDeleteStudent(userId)}
                        />
                        <Sheet open={editOpen} onOpenChange={setEditOpen}>
                            <SheetContent className="p-4">
                                <SheetHeader>
                                    <SheetTitle>Update student</SheetTitle>
                                </SheetHeader>
                                <PromotionStudentForm
                                    onSubmit={(data) =>
                                        onStudentUpdate(userId, data)
                                    }
                                    studentUserData={row.original}
                                />
                            </SheetContent>
                        </Sheet>
                    </>
                );
            },
        },
    ];

    useEffect(() => {
        getPromotion();
    }, []);

    const handleFileUpload = async () => {
        if (!importFile) {
            toast.error("The file is required for import");
            return;
        }
        const file = importFile.target.files?.[0];

        if (!file) {
            return;
        }

        const fileName = file.name.toLowerCase();

        const isJsonFile = fileName.endsWith(".json");

        const reader = new FileReader();

        const parsedData = (await new Promise((resolve, reject) => {
            reader.onload = (e) => {
                try {
                    const result = e.target?.result as string;

                    if (isJsonFile) resolve(JSON.parse(result));

                    const workbook = XLSX.read(result, {
                        type: "array",
                    });

                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];

                    const jsonData = XLSX.utils.sheet_to_json(
                        worksheet,
                    ) as Omit<PromotionStudentRequest, "promotionId">[];

                    resolve(jsonData);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => {
                reject(new Error("Error on file parsing"));
            };
            reader[isJsonFile ? "readAsText" : "readAsArrayBuffer"](file);
        })) as Omit<PromotionStudentRequest, "promotionId">[];

        try {
            await promotionService.createPromotionStudents(
                parsedData.map((data) => ({
                    ...data,
                    promotionId: promotion!.id,
                })),
            );
            getPromotion();
            setImportOpen(false);
            toast.success("Students was successfully imported");
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold">{`Promotion: ${promotion?.name}`}</h1>
            <Table
                data={
                    promotion?.promotionStudents
                        ? promotion?.promotionStudents.map(
                              ({ student }) => student!.user!,
                          )
                        : []
                }
                columns={columns}
                tableHeader={
                    <div className="ml-auto flex gap-4">
                        <Button
                            className="ml-auto"
                            variant="outline"
                            onClick={() => setImportOpen(true)}
                        >
                            <CirclePlus />
                            Import student
                        </Button>
                        <Button
                            className="ml-auto"
                            variant="outline"
                            onClick={() => setOpen(true)}
                        >
                            <CirclePlus />
                            Add student
                        </Button>
                    </div>
                }
            />

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent className="p-4">
                    <SheetHeader>
                        <SheetTitle>Add student</SheetTitle>
                        <SheetDescription>
                            Add student to promotion
                        </SheetDescription>
                    </SheetHeader>
                    <PromotionStudentForm onSubmit={onAddStudentToPromotion} />
                </SheetContent>
            </Sheet>

            <Sheet open={importOpen} onOpenChange={setImportOpen}>
                <SheetContent className="p-4">
                    <SheetHeader>
                        <SheetTitle>Import student</SheetTitle>
                        <SheetDescription>
                            Import student to promotion
                        </SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col gap-2 px-4">
                        <Label htmlFor="file">File</Label>
                        <Input
                            id="file"
                            type="file"
                            placeholder="First name"
                            accept=".json, .xlsx"
                            onChange={setImportFile}
                        />
                    </div>
                    <SheetFooter>
                        <Button onClick={handleFileUpload}>Import</Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    );
};
