import { ThemeProvider } from "./components/ui/theme-provider";
import { UnauthotentifiedWrapper } from "./components/wrappers/UnauthotentifiedWrapper";
import { AuthentificationPage } from "./pages/authentificationPage/AuthentificationPage";

export const App = () => {
    return (
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <UnauthotentifiedWrapper>
                <AuthentificationPage />
            </UnauthotentifiedWrapper>
        </ThemeProvider>
    );
};
