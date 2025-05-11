import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo } from "react";
import { AuthService } from "@/services/authService/AuthService";
import { useForm } from "react-hook-form";
import { RegisterRequest } from "@/types/Auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ApiException } from "@/services/api/ApiException";
import { toast } from "sonner";
import { SetState } from "@/types/React";
import { AUTH_TABS, AuthTabs } from "@/enums/AuthTabs";
import { USER_ROLE } from "@/enums/UserRole";
import { SsoButtons } from "../ssoButtons/SsoButtons";

const schema = z
    .object({
        email: z.string().email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        firstName: z.string().nonempty(),
        lastName: z.string().nonempty(),
    })
    .required();

export const RegisterForm = ({
    setCurrentTab,
}: {
    setCurrentTab: SetState<AuthTabs>;
}) => {
    const authService = useMemo(() => new AuthService(), []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Omit<RegisterRequest, "role">>({
        resolver: zodResolver(schema),
    });

    const onRegisterSubmit = async (data: Omit<RegisterRequest, "role">) => {
        try {
            await authService.register({
                ...data,
                role: USER_ROLE.TEACHER,
            });
            setCurrentTab(AUTH_TABS.LOGIN);
            toast.success("Register successfull");
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Register</CardTitle>
                    <CardDescription>
                        Login with your Google or Microsoft account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <SsoButtons />
                    </div>
                    <form onSubmit={handleSubmit(onRegisterSubmit)}>
                        <div className="grid gap-6">
                            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                            <div className="grid gap-6">
                                <div className="flex gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="firstname">
                                            First name
                                        </Label>
                                        <Input
                                            id="firstname"
                                            type="text"
                                            placeholder="First name"
                                            {...register("firstName")}
                                        />
                                        <CardDescription className="text-red-500">
                                            {errors.firstName?.message}
                                        </CardDescription>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="lastname">
                                            Last name
                                        </Label>
                                        <Input
                                            id="lastname"
                                            type="text"
                                            placeholder="Last name"
                                            {...register("lastName")}
                                        />
                                        <CardDescription className="text-red-500">
                                            {errors.lastName?.message}
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="email@example.com"
                                        {...register("email")}
                                    />
                                    <CardDescription className="text-red-500">
                                        {errors.email?.message}
                                    </CardDescription>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        {...register("password")}
                                    />
                                    <CardDescription className="text-red-500">
                                        {errors.password?.message}
                                    </CardDescription>
                                </div>

                                <Button type="submit" className="w-full">
                                    Register
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
