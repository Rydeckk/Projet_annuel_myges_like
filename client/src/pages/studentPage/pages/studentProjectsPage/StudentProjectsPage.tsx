import { PromotionProjectContextProvider } from "../../context/PromotionProjectContext";
import { StudentProject } from "./components/StudentProject/StudentProject";

export const StudentProjectPage = () => {
    return (
        <PromotionProjectContextProvider>
            <StudentProject />
        </PromotionProjectContextProvider>
    );
};
