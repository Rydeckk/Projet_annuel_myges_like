import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Upload,
    Download,
    Edit,
    Trash2,
    FileArchive,
    User,
    Calendar,
} from "lucide-react";
import { Deliverable, UpdateDeliverableRequest } from "@/types/Deliverable";
import { DeliverableService } from "@/services/deliverableService/DeliverableService";
import { UploadService } from "@/services/uploadService/UploadService";
import { ApiException } from "@/services/api/ApiException";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDropzone } from "react-dropzone";

const updateSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .max(100, "Name must be less than 100 characters"),
    description: z.string().optional(),
});

type UpdateFormData = z.infer<typeof updateSchema>;

type DeliverableCardProps = {
    deliverable: Deliverable;
    onUpdate: () => void;
    onDelete: () => void;
};

export const DeliverableCard = ({
    deliverable,
    onUpdate,
    onDelete,
}: DeliverableCardProps) => {
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const deliverableService = useMemo(() => new DeliverableService(), []);
    const uploadService = useMemo(() => new UploadService(), []);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<UpdateFormData>({
        resolver: zodResolver(updateSchema),
        defaultValues: {
            name: deliverable.name,
            description: deliverable.description || "",
        },
    });

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            if (acceptedFiles.length === 0) return;

            const file = acceptedFiles[0];
            const allowedTypes = [".zip", ".rar", ".tar.gz", ".7z"];
            const fileExtension = file.name.toLowerCase();

            if (!allowedTypes.some((ext) => fileExtension.endsWith(ext))) {
                toast.error(
                    "Invalid file type. Only zip, rar, tar.gz, and 7z files are allowed.",
                );
                return;
            }

            const maxSize = 100 * 1024 * 1024; // 100MB
            if (file.size > maxSize) {
                toast.error("File too large. Maximum size is 100MB.");
                return;
            }

            try {
                setUploading(true);

                // Step 1: Upload file to get URL
                const fileUrl = await uploadService.upload({
                    name: file.name,
                    description: `Archive for ${deliverable.name}`,
                    file,
                });

                // Step 2: Attach the uploaded file to the deliverable
                await deliverableService.attachFile(
                    deliverable.id,
                    fileUrl,
                    file.name,
                    file.size,
                );

                toast.success("Archive uploaded successfully");
                onUpdate();
            } catch (error) {
                if (error instanceof ApiException) {
                    toast.error(error.message);
                } else {
                    toast.error("Failed to upload archive");
                }
            } finally {
                setUploading(false);
            }
        },
        [deliverable.id, deliverableService, onUpdate],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/zip": [".zip"],
            "application/x-rar-compressed": [".rar"],
            "application/x-7z-compressed": [".7z"],
            "application/gzip": [".tar.gz"],
        },
        multiple: false,
    });

    const handleUpdate = async (data: UpdateFormData) => {
        try {
            setUpdating(true);
            const request: UpdateDeliverableRequest = data;
            await deliverableService.update(deliverable.id, request);
            toast.success("Deliverable updated successfully");
            setShowEditDialog(false);
            onUpdate();
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            } else {
                toast.error("Failed to update deliverable");
            }
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this deliverable?"))
            return;

        try {
            setDeleting(true);
            await deliverableService.delete(deliverable.id);
            toast.success("Deliverable deleted successfully");
            onDelete();
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            } else {
                toast.error("Failed to delete deliverable");
            }
        } finally {
            setDeleting(false);
        }
    };

    const handleDownload = async () => {
        try {
            const downloadInfo = await deliverableService.downloadArchive(
                deliverable.id,
            );
            // Open the file URL in a new tab to download
            window.open(downloadInfo.url, "_blank");
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            } else {
                toast.error("Failed to download archive");
            }
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-lg">
                            {deliverable.name}
                        </CardTitle>
                        {deliverable.description && (
                            <p className="text-sm text-muted-foreground">
                                {deliverable.description}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge
                            variant={
                                deliverable.deliverableArchive
                                    ? "default"
                                    : "secondary"
                            }
                        >
                            {deliverable.deliverableArchive
                                ? "Uploaded"
                                : "No file"}
                        </Badge>
                        <div className="flex gap-1">
                            <Dialog
                                open={showEditDialog}
                                onOpenChange={setShowEditDialog}
                            >
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Edit Deliverable
                                        </DialogTitle>
                                    </DialogHeader>
                                    <form
                                        onSubmit={handleSubmit(handleUpdate)}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                {...register("name")}
                                                placeholder="Enter deliverable name"
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-500">
                                                    {errors.name.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description">
                                                Description (optional)
                                            </Label>
                                            <Textarea
                                                id="description"
                                                {...register("description")}
                                                placeholder="Enter description"
                                                rows={3}
                                            />
                                        </div>

                                        <div className="flex gap-2 justify-end">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setShowEditDialog(false);
                                                    reset();
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={updating}
                                            >
                                                {updating
                                                    ? "Updating..."
                                                    : "Update"}
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>
                            {deliverable.uploadedByStudent?.user?.firstName}{" "}
                            {deliverable.uploadedByStudent?.user?.lastName}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                            {new Date(
                                deliverable.createdAt,
                            ).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {deliverable.deliverableArchive ? (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                                <FileArchive className="h-8 w-8 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">
                                        {deliverable.deliverableArchive.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatFileSize(
                                            deliverable.deliverableArchive
                                                .fileSize,
                                        )}
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDownload}
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                            </Button>
                        </div>

                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                                isDragActive
                                    ? "border-primary bg-primary/5"
                                    : "border-muted-foreground/25 hover:border-primary/50"
                            }`}
                        >
                            <input {...getInputProps()} />
                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                {uploading
                                    ? "Uploading..."
                                    : isDragActive
                                      ? "Drop file here to replace current archive"
                                      : "Click or drag to replace current archive"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Supported: ZIP, RAR, 7Z, TAR.GZ (max 100MB)
                            </p>
                        </div>
                    </div>
                ) : (
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                            isDragActive
                                ? "border-primary bg-primary/5"
                                : "border-muted-foreground/25 hover:border-primary/50"
                        }`}
                    >
                        <input {...getInputProps()} />
                        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-lg font-medium mb-2">
                            {uploading ? "Uploading..." : "Upload your archive"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {isDragActive
                                ? "Drop your file here"
                                : "Click here or drag and drop your archive file"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                            Supported formats: ZIP, RAR, 7Z, TAR.GZ (max 100MB)
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
