import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TeacherPromotionProjectsReportSectionsPage } from "../teacherPromotionProjectsReportSectionsPage/TeacherPromotionProjectsReportSectionsPage";
import { TeacherProjectGroup } from "./pages/teacherProjectGroup/TeacherProjectGroup";
import { TeacherProjectDeliverablePage } from "../teacherProjectDeliverablePage/TeacherProjectDeliverablePage";

export const TeacherPromotionProjectDetailPage = () => {
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
                    value="deliverable-sections"
                    className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                >
                    Deliverable sections
                </TabsTrigger>
            </TabsList>
            <TabsContent value="detail">
                <p className="p-4 text-center text-xs text-muted-foreground">
                    Content for Tab 1
                </p>
            </TabsContent>
            <TabsContent value="project-groups">
                <TeacherProjectGroup />
            </TabsContent>
            <TabsContent value="report-sections">
                <TeacherPromotionProjectsReportSectionsPage />
            </TabsContent>
            <TabsContent value="deliverable-sections">
                <TeacherProjectDeliverablePage />
            </TabsContent>
        </Tabs>
    );
};
