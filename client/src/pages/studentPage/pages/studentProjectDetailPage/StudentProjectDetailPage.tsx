import { ProjectGroupContextProvider } from "../../context/ProjectGroupContext";
import { StudentProjectDetail } from "./StudentProjectDetail/StudentProjectDetail";

export const StudentProjectDetailPage = () => {
    return (
        <ProjectGroupContextProvider>
            <StudentProjectDetail />
        </ProjectGroupContextProvider>
    );
};
