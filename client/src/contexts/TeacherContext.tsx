import { createContext, ReactNode } from "react";

const TeacherContext = createContext(null);

type Props = {
    children: ReactNode;
};

const TeacherContextProvider = ({ children }: Props) => {
    return (
        <TeacherContext.Provider value={null}>
            {children}
        </TeacherContext.Provider>
    );
};

export { TeacherContext, TeacherContextProvider };
