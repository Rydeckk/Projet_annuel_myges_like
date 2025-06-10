import { cn } from "@/utils/utils";
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
import { SsoButtons } from "../ssoButtons/SsoButtons";
import { AuthService } from "@/services/authService/AuthService";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { LoginRequest } from "@/types/Auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ApiException } from "@/services/api/ApiException";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { USER_ROLE } from "@/enums/UserRole";

const schema = z
    .object({
        email: z.string().email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    })
    .required();

export const LoginForm = ({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) => {
    const navigate = useNavigate();
    const authService = useMemo(() => new AuthService(), []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginRequest>({ resolver: zodResolver(schema) });

    const onLoginSubmit = async (data: LoginRequest) => {
        try {
            const { accessToken, userRole } = await authService.login(data);
            Cookies.set("token", accessToken);
            toast.success("Login successfull");
            navigate(userRole === USER_ROLE.STUDENT ? "/student" : "/teacher");
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Login</CardTitle>
                    <CardDescription>
                        Login with your Google or Microsoft account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <SsoButtons />
                    </div>
                    <form onSubmit={handleSubmit(onLoginSubmit)}>
                        <div className="grid gap-6">
                            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                            <div className="grid gap-6">
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
                                    <div className="flex items-center">
                                        <Label htmlFor="password">
                                            Password
                                        </Label>
                                        <button className="ml-auto text-sm underline-offset-4 hover:underline">
                                            Forgot your password?
                                        </button>
                                    </div>
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
                                    Login
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
