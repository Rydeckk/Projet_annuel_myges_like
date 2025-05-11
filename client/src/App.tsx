import { UnauthotentifiedWrapper } from "./components/wrappers/UnauthotentifiedWrapper";
import { Authentification } from "./pages/authentification/Authentification";

export const App = () => {
    return (
        <UnauthotentifiedWrapper>
            <Authentification />
        </UnauthotentifiedWrapper>
    );
};
