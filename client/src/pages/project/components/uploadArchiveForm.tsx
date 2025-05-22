import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ApiException } from "@/services/api/ApiException";
import { RawUploadRequest, UploadRequest } from "@/types/Project";
import { cn } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@radix-ui/react-label";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UploadService } from "@/services/uploadService/UploadService";
import { useMemo } from "react";

const schema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    file: z
        .instanceof(FileList)
        .refine((f) => f.length > 0, "File is required")
        .transform((f) => f[0]),
});

export const UploadArchiveForm = ({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) => {
    const uploadService = useMemo(() => new UploadService(), []);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<RawUploadRequest, unknown, UploadRequest>({
        resolver: zodResolver(schema),
    });

    const onUploadArchiveSubmit = async (data: UploadRequest) => {
        const file = data.file;
        const allowedExtensions = ["zip", "rar", "7z", "tar", "gz", "txt"];

        const extension = file?.name.split(".").pop()?.toLowerCase();
        if (!extension || !allowedExtensions.includes(extension)) {
            setError("file", {
                type: "manual",
                message: "Extension de fichier non autorisée",
            });
            return;
        }

        try {
            await uploadService.upload(data);
            toast.success("Upload successfull");
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    };

    return (
        <div
            className={cn(
                "flex min-h-svh flex-col items-center justify-center gap-6",
                className,
            )}
            {...props}
        >
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Upload</CardTitle>
                    <CardDescription>Upload your archive here</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onUploadArchiveSubmit)}>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    {...register("name")}
                                />
                                <CardDescription className="text-red-500">
                                    {errors.name?.message}
                                </CardDescription>
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                </div>
                                <Input
                                    id="description"
                                    type="text"
                                    {...register("description")}
                                />
                                <CardDescription className="text-red-500">
                                    {errors.description?.message}
                                </CardDescription>
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="archive">Archive</Label>
                                </div>
                                <Input
                                    id="archive"
                                    type="file"
                                    {...register("file")}
                                />
                                <CardDescription className="text-red-500">
                                    {errors.file?.message}
                                </CardDescription>
                            </div>
                            <Button type="submit" className="w-full">
                                Upload
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
