import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DeliverableService } from "@/services/deliverableService/DeliverableService";
import { CreateDeliverableRequest } from "@/types/Deliverable";
import { ApiException } from "@/services/api/ApiException";
import { toast } from "sonner";

const schema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .max(100, "Name must be less than 100 characters"),
    description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

type CreateDeliverableFormProps = {
    projectGroupId: string;
    onSuccess: () => void;
    onCancel: () => void;
};

export const CreateDeliverableForm = ({
    projectGroupId,
    onSuccess,
    onCancel,
}: CreateDeliverableFormProps) => {
    const [loading, setLoading] = useState(false);
    const deliverableService = useMemo(() => new DeliverableService(), []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true);
            const request: CreateDeliverableRequest = {
                ...data,
                projectGroupId,
            };
            await deliverableService.create(request);
            toast.success("Deliverable created successfully");
            onSuccess();
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            } else {
                toast.error("Failed to create deliverable");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Enter description"
                    rows={3}
                />
                {errors.description && (
                    <p className="text-sm text-red-500">
                        {errors.description.message}
                    </p>
                )}
            </div>

            <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create"}
                </Button>
            </div>
        </form>
    );
};
