import { TeacherPromotionContextProvider } from "@/pages/teacherPage/contexts/TeacherPromotionContext";
import { TeacherPromotions } from "./teacherPromotions/TeacherPromotions";

export const TeacherPromotionsPage = () => {
    return (
        <TeacherPromotionContextProvider>
            <TeacherPromotions />
        </TeacherPromotionContextProvider>
    );
};
