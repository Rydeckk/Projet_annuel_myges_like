import { useContext } from "react";
import { StudentPromotionProjectContext } from "../../contexts/StudentPromotionProjectContext";
import { StudentProjectDetailCard } from "./components/studentProjectDetailCard/StudentProjectDetailCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentProjectDeliverablePage } from "../studentProjectDeliverablePage/StudentProjectDeliverablePage";
import { StudentProjectGroupsPage } from "../studentProjectGroupsPage/StudentProjectGroupsPage";

export const StudentProjectDetailPage = () => {
    const { promotionProject, studentProjectGroup } = useContext(
        StudentPromotionProjectContext,
    );

    return (
        <Tabs defaultValue="detail">
            <TabsList className="h-auto gap-2 rounded-none border-b border-border bg-transparent px-0 py-1 text-foreground w-full">
                <TabsTrigger
                    value="detail"
                    className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                >
                    Project Detail
                </TabsTrigger>
                <TabsTrigger
                    value="project-groups"
                    className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                >
                    Project Groups
                </TabsTrigger>
                <TabsTrigger
                    value="report-sections"
                    className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                >
                    Report Sections
                </TabsTrigger>
                <TabsTrigger
                    value="deliverable"
                    className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                >
                    Deliverable sections
                </TabsTrigger>
            </TabsList>
            <TabsContent value="detail">
                {promotionProject && studentProjectGroup && (
                    <StudentProjectDetailCard
                        projectGroup={studentProjectGroup}
                        promotionProject={promotionProject}
                    />
                )}
            </TabsContent>
            <TabsContent value="project-groups">
                <StudentProjectGroupsPage />
            </TabsContent>
            <TabsContent value="report-sections"></TabsContent>
            <TabsContent value="deliverable">
                <StudentProjectDeliverablePage />
            </TabsContent>
        </Tabs>
    );
};
