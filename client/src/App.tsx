import { UnauthotentifiedWrapper } from "./components/wrappers/UnauthotentifiedWrapper";
import { AuthentificationPage } from "./pages/authentificationPage/AuthentificationPage";

export const App = () => {
    return (
        <UnauthotentifiedWrapper>
            <AuthentificationPage />
        </UnauthotentifiedWrapper>
    );
};
