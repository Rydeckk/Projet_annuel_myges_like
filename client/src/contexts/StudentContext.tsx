import { createContext, ReactNode } from "react";
import { UserWithDetails } from "@/services/authService/AuthService";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type StudentContextType = {
    user: UserWithDetails | null;
    loading: boolean;
    error: string | null;
};

const StudentContext = createContext<StudentContextType | null>(null);

type Props = {
    children: ReactNode;
};

const StudentContextProvider = ({ children }: Props) => {
    const value = useCurrentUser();

    return (
        <StudentContext.Provider value={value}>
            {children}
        </StudentContext.Provider>
    );
};

export { StudentContext, StudentContextProvider };
