import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { PROJECT_GROUP_RULE } from "@/enums/ProjectGroupRule";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Label } from "@radix-ui/react-label";
// import { useForm } from "react-hook-form";
// import { z } from "zod";

// const schema = z
//     .object({
//         minPerGroup: z.number(),
//         maxPerGroup: z.number(),
//         malus: z.number().optional(),
//         malusPerTime: z.coerce.date().optional(),
//         allowLateSubmission: z.boolean(),
//         projectGroupRule: z.nativeEnum(PROJECT_GROUP_RULE),
//         promotionId: z.string().uuid().nonempty(),
//     })
//     .required();

export const PromotionProjectFrom = () => {
    // const {
    //     register,
    //     handleSubmit,
    //     formState: { errors },
    // } = useForm<>({ resolver: zodResolver(schema) });

    return (
        <form className="flex flex-col gap-4 px-4">
            {/* <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register("name")} />
                <p className="text-red-500">{errors.minPerGroup?.message}</p>
            </div> */}
            <Button type="submit">Save</Button>
        </form>
    );
};
