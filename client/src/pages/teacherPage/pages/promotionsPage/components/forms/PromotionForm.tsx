import { PromotionRequest } from "@/types/Promotion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format, isBefore, isEqual, startOfDay } from "date-fns";

const schema = z
    .object({
        name: z.string().nonempty(),
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
    })
    .required()
    .refine((data) => !isBefore(data.startDate, startOfDay(new Date())), {
        message: "Start date cannot be in the past",
        path: ["startDate"],
    })
    .refine((data) => !isBefore(data.endDate, data.startDate), {
        message: "End date must be after start date",
        path: ["endDate"],
    })
    .refine((data) => !isEqual(data.startDate, data.endDate), {
        message: "Start and end dates cannot be identical",
        path: ["startDate"],
    })
    .refine((data) => !isEqual(data.startDate, data.endDate), {
        message: "Start and end dates cannot be identical",
        path: ["endDate"],
    });

type Props = {
    promotionData?: PromotionRequest;
    onSubmit: (data: PromotionRequest) => void;
};

export const PromotionForm = ({
    promotionData = undefined,
    onSubmit,
}: Props) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PromotionRequest>({ resolver: zodResolver(schema) });

    return (
        <form
            className="flex flex-col gap-4 px-4"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    {...register("name")}
                    defaultValue={promotionData?.name}
                />
                <p className="text-red-500">{errors.name?.message}</p>
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="startDate">Start date</Label>
                <Input
                    id="startDate"
                    {...register("startDate")}
                    type="date"
                    defaultValue={
                        promotionData
                            ? format(promotionData.startDate, "yyyy-MM-dd")
                            : undefined
                    }
                />
                <p className="text-red-500">{errors.startDate?.message}</p>
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="endDate">End date</Label>
                <Input
                    id="endDate"
                    {...register("endDate")}
                    type="date"
                    defaultValue={
                        promotionData
                            ? format(promotionData.endDate, "yyyy-MM-dd")
                            : undefined
                    }
                />
                <p className="text-red-500">{errors.endDate?.message}</p>
            </div>
            <Button type="submit">Save</Button>
        </form>
    );
};
