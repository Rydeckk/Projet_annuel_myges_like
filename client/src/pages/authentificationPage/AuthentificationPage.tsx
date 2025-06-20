import { LoginForm } from "@/pages/authentificationPage/components/loginForm/LoginForm";
import { RegisterForm } from "@/pages/authentificationPage/components/registerForm/RegisterForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AUTH_TABS, AuthTabs } from "@/enums/AuthTabs";
import { useState } from "react";

export const AuthentificationPage = () => {
    const [currentTab, setCurrentTab] = useState<AuthTabs>(AUTH_TABS.LOGIN);

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6">
            <Tabs
                value={currentTab}
                onValueChange={setCurrentTab}
                className="w-[400px]"
            >
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value={AUTH_TABS.REGISTER}>
                        Register
                    </TabsTrigger>
                    <TabsTrigger value={AUTH_TABS.LOGIN}>Login</TabsTrigger>
                </TabsList>
                <TabsContent value={AUTH_TABS.REGISTER}>
                    <RegisterForm setCurrentTab={setCurrentTab} />
                </TabsContent>
                <TabsContent value={AUTH_TABS.LOGIN}>
                    <LoginForm />
                </TabsContent>
            </Tabs>
        </div>
    );
};
