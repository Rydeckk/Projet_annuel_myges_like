import { createContext, ReactNode } from "react";

const StudentContext = createContext(null);

type Props = {
    children: ReactNode;
};

const StudentContextProvider = ({ children }: Props) => {
    return (
        <StudentContext.Provider value={null}>
            {children}
        </StudentContext.Provider>
    );
};

export { StudentContext, StudentContextProvider };
