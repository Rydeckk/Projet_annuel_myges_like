import { createContext, ReactNode } from "react";
import { UserWithDetails } from "@/services/authService/AuthService";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type TeacherContextType = {
    user: UserWithDetails | null;
    loading: boolean;
    error: string | null;
};

const TeacherContext = createContext<TeacherContextType | null>(null);

type Props = {
    children: ReactNode;
};

const TeacherContextProvider = ({ children }: Props) => {
    const value = useCurrentUser();

    return (
        <TeacherContext.Provider value={value}>
            {children}
        </TeacherContext.Provider>
    );
};

export { TeacherContext, TeacherContextProvider };
