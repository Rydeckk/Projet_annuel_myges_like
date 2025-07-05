import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeacherProjectDeliverableReport } from "./components/teacherProjectDeliverableReport/TeacherProjectDeliverableReport";
import { TeacherProjectDeliverableMain } from "./components/teacherProjectDeliverableMain/TeacherProjectDeliverableMain";

export const TeacherProjectDeliverablePage = () => {
    return (
        <Tabs defaultValue="project-deliverable">
            <TabsList className="h-auto gap-2 rounded-none border-b border-border bg-transparent px-0 py-1 text-foreground">
                <TabsTrigger
                    value="project-deliverable"
                    className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                >
                    Project Deliverable
                </TabsTrigger>
                <TabsTrigger
                    value="project-report"
                    className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                >
                    Project Report
                </TabsTrigger>
            </TabsList>
            <TabsContent value="project-deliverable">
                <TeacherProjectDeliverableMain />
            </TabsContent>
            <TabsContent value="project-report">
                <TeacherProjectDeliverableReport />
            </TabsContent>
        </Tabs>
    );
};
