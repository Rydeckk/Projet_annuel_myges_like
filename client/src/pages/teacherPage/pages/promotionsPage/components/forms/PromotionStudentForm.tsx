import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PromotionStudentRequest } from "@/types/Promotion";
import { User } from "@/types/User";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z
    .object({
        email: z.string().email("Invalid email format"),
        firstName: z.string().nonempty(),
        lastName: z.string().nonempty(),
    })
    .required();

type Props = {
    studentUserData?: User;
    onSubmit: (data: Omit<PromotionStudentRequest, "promotionId">) => void;
};

export const PromotionStudentForm = ({
    studentUserData = undefined,
    onSubmit,
}: Props) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Omit<PromotionStudentRequest, "promotionId">>({
        resolver: zodResolver(schema),
    });

    return (
        <form
            className="flex flex-col gap-4 px-4"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="flex flex-col gap-2">
                <Label htmlFor="firstname">First name</Label>
                <Input
                    id="firstname"
                    type="text"
                    placeholder="First name"
                    {...register("firstName")}
                    defaultValue={studentUserData?.firstName}
                />
                <p className="text-red-500">{errors.firstName?.message}</p>
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="lastname">Last name</Label>
                <Input
                    id="lastname"
                    type="text"
                    placeholder="Last name"
                    {...register("lastName")}
                    defaultValue={studentUserData?.lastName}
                />
                <p className="text-red-500">{errors.lastName?.message}</p>
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    {...register("email")}
                    defaultValue={studentUserData?.email}
                />
                <p className="text-red-500">{errors.email?.message}</p>
            </div>

            <Button type="submit">Save</Button>
        </form>
    );
};
