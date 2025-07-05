import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Users,
    CheckCircle,
    XCircle,
    AlertTriangle,
    FileText,
    BarChart3,
} from "lucide-react";
import { TeacherDashboardService } from "@/services/teacherDashboardService/TeacherDashboardService";
import { SimilarityAnalysisService } from "@/services/similarityAnalysisService/SimilarityAnalysisService";
import type {
    ProjectOverview,
    SubmissionStatus,
    ComplianceStatus,
    SimilarityResult,
} from "@/services/teacherDashboardService/TeacherDashboardService";
import { TeacherDeliverableList } from "../teacherDeliverableList/TeacherDeliverableList";
import { DeliverableRulesManager } from "../deliverableRulesManager/DeliverableRulesManager";

export const TeacherProjectDeliverableMain = () => {
    const { promotionProjectId } = useParams<{ promotionProjectId: string }>();
    const [overview, setOverview] = useState<ProjectOverview | null>(null);
    const [submissions, setSubmissions] = useState<SubmissionStatus[]>([]);
    const [compliance, setCompliance] = useState<ComplianceStatus[]>([]);
    const [similarity, setSimilarity] = useState<SimilarityResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    const loadData = useCallback(async () => {
        const teacherDashboardService = new TeacherDashboardService();
        const similarityService = new SimilarityAnalysisService();
        if (!promotionProjectId) return;

        setLoading(true);
        try {
            const [
                overviewData,
                submissionsData,
                complianceData,
                similarityData,
            ] = await Promise.all([
                teacherDashboardService.getProjectOverview(promotionProjectId),
                teacherDashboardService.getSubmissions(promotionProjectId),
                teacherDashboardService.getCompliance(promotionProjectId),
                similarityService.getProjectAnalysis(promotionProjectId),
            ]);

            setOverview(overviewData);
            setSubmissions(submissionsData);
            setCompliance(complianceData);
            setSimilarity(similarityData.results || []);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    }, [promotionProjectId]);

    useEffect(() => {
        if (!promotionProjectId) return;
        loadData();
    }, [promotionProjectId, loadData]);

    const handleAnalyzeSimilarity = async () => {
        if (!promotionProjectId) return;

        const similarityService = new SimilarityAnalysisService();
        try {
            await similarityService.analyzeProject(promotionProjectId);
            // Reload similarity data
            await loadData();
        } catch (error) {
            console.error("Error analyzing similarity:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-sm text-muted-foreground">
                        Loading dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Project Overview Cards */}
            {overview && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Groups
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {overview.totalGroups}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {overview.submittedGroups} submitted,{" "}
                                {overview.pendingGroups} pending
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Submission Rate
                            </CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {overview.totalGroups > 0
                                    ? Math.round(
                                          (overview.submittedGroups /
                                              overview.totalGroups) *
                                              100,
                                      )
                                    : 0}
                                %
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {overview.submittedGroups} of{" "}
                                {overview.totalGroups} groups
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Compliance Rate
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {Math.round(overview.complianceRate)}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Rules compliance average
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Avg Similarity
                            </CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {Math.round(overview.averageSimilarity)}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Between submissions
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Main Dashboard Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
                    <TabsTrigger value="compliance">Compliance</TabsTrigger>
                    <TabsTrigger value="similarity">Similarity</TabsTrigger>
                    <TabsTrigger value="rules">Rules</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Submissions Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Submission Status by Group
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {submissions.map((submission) => (
                                        <div
                                            key={submission.groupId}
                                            className="flex items-center justify-between p-2 border rounded"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {submission.groupName}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {submission.students.length}{" "}
                                                    student(s)
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {submission.deliverables.map(
                                                    (deliverable) => (
                                                        <Badge
                                                            key={deliverable.id}
                                                            variant={
                                                                deliverable.submitted
                                                                    ? "default"
                                                                    : "secondary"
                                                            }
                                                        >
                                                            {deliverable.submitted ? (
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                            ) : (
                                                                <XCircle className="w-3 h-3 mr-1" />
                                                            )}
                                                            {deliverable.name}
                                                        </Badge>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Compliance Overview */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Rules Compliance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {compliance.map((comp) => (
                                        <div
                                            key={comp.groupId}
                                            className="flex items-center justify-between p-2 border rounded"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {comp.groupName}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {comp.passedRules}/
                                                    {comp.totalRules} rules
                                                    passed
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Badge
                                                    variant={
                                                        comp.complianceRate >=
                                                        80
                                                            ? "default"
                                                            : comp.complianceRate >=
                                                                50
                                                              ? "secondary"
                                                              : "destructive"
                                                    }
                                                >
                                                    {Math.round(
                                                        comp.complianceRate,
                                                    )}
                                                    %
                                                </Badge>
                                                {comp.complianceRate < 100 && (
                                                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="deliverables">
                    <TeacherDeliverableList
                        promotionProjectId={promotionProjectId!}
                        submissions={submissions}
                    />
                </TabsContent>

                <TabsContent value="compliance" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">
                            Rules Compliance Details
                        </h3>
                        <Button variant="outline" onClick={loadData}>
                            Refresh
                        </Button>
                    </div>

                    <div className="grid gap-4">
                        {compliance.map((comp) => (
                            <Card key={comp.groupId}>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-base">
                                            {comp.groupName}
                                        </CardTitle>
                                        <Badge
                                            variant={
                                                comp.complianceRate >= 80
                                                    ? "default"
                                                    : comp.complianceRate >= 50
                                                      ? "secondary"
                                                      : "destructive"
                                            }
                                        >
                                            {Math.round(comp.complianceRate)}%
                                            compliant
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                        {comp.ruleDetails.map((rule) => (
                                            <div
                                                key={rule.ruleId}
                                                className={`p-2 rounded border ${
                                                    rule.passed
                                                        ? "bg-green-50 border-green-200"
                                                        : "bg-red-50 border-red-200"
                                                }`}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    {rule.passed ? (
                                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                                    ) : (
                                                        <XCircle className="w-4 h-4 text-red-600" />
                                                    )}
                                                    <span className="text-sm font-medium">
                                                        {rule.ruleType}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="similarity" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">
                            Similarity Analysis
                        </h3>
                        <Button onClick={handleAnalyzeSimilarity}>
                            Run Analysis
                        </Button>
                    </div>

                    <div className="grid gap-4">
                        {similarity.map((sim, index) => (
                            <Card key={index}>
                                <CardContent className="pt-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">
                                                {sim.group1Name} ↔{" "}
                                                {sim.group2Name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Deliverables comparison
                                            </p>
                                        </div>
                                        <Badge
                                            variant={
                                                sim.similarityRate >= 70
                                                    ? "destructive"
                                                    : sim.similarityRate >= 50
                                                      ? "secondary"
                                                      : "default"
                                            }
                                        >
                                            {Math.round(sim.similarityRate)}%
                                            similar
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="rules">
                    <DeliverableRulesManager
                        promotionProjectId={promotionProjectId!}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};
