import { useCallback, useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Plus,
    Edit,
    Trash2,
    FileText,
    FolderOpen,
    HardDrive,
    Search,
} from "lucide-react";
import { DeliverableRulesService } from "@/services/deliverableRulesService/DeliverableRulesService";
import type { DeliverableRule } from "@/services/deliverableRulesService/DeliverableRulesService";
import { CreateRuleForm } from "../createRuleForm/CreateRuleForm";
import { EditRuleForm } from "../editRuleForm/EditRuleForm";

interface DeliverableRulesManagerProps {
    promotionProjectId: string;
}

export const DeliverableRulesManager = ({
    promotionProjectId,
}: DeliverableRulesManagerProps) => {
    const [allRules, setAllRules] = useState<DeliverableRule[]>([]);
    const [projectRules, setProjectRules] = useState<
        { deliverableRule: DeliverableRule }[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedRule, setSelectedRule] = useState<DeliverableRule | null>(
        null,
    );

    const loadRules = useCallback(async () => {
        const rulesService = new DeliverableRulesService();
        setLoading(true);
        try {
            const [allRulesData, projectRulesData] = await Promise.all([
                rulesService.findAll(),
                rulesService.getPromotionProjectRules(promotionProjectId),
            ]);

            setAllRules(allRulesData);
            setProjectRules(projectRulesData);
        } catch (error) {
            console.error("Error loading rules:", error);
        } finally {
            setLoading(false);
        }
    }, [promotionProjectId]);

    useEffect(() => {
        loadRules();
    }, [loadRules]);

    const handleAssignRule = async (ruleId: string) => {
        const rulesService = new DeliverableRulesService();
        try {
            await rulesService.assignToPromotionProject({
                deliverableRuleId: ruleId,
                promotionProjectId,
            });
            await loadRules();
        } catch (error) {
            console.error("Error assigning rule:", error);
        }
    };

    const handleUnassignRule = async (ruleId: string) => {
        const rulesService = new DeliverableRulesService();
        try {
            await rulesService.removeFromPromotionProject(
                ruleId,
                promotionProjectId,
            );
            await loadRules();
        } catch (error) {
            console.error("Error unassigning rule:", error);
        }
    };

    const handleDeleteRule = async (ruleId: string) => {
        if (!confirm("Are you sure you want to delete this rule?")) return;

        const rulesService = new DeliverableRulesService();
        try {
            await rulesService.delete(ruleId);
            await loadRules();
        } catch (error) {
            console.error("Error deleting rule:", error);
        }
    };

    const handleEditRule = (rule: DeliverableRule) => {
        setSelectedRule(rule);
        setEditDialogOpen(true);
    };

    const getRuleIcon = (ruleType: string) => {
        switch (ruleType) {
            case "MAX_SIZE_FILE":
                return <HardDrive className="w-4 h-4" />;
            case "FILE_PRESENCE":
                return <FileText className="w-4 h-4" />;
            case "FILE_CONTENT_MATCH":
                return <Search className="w-4 h-4" />;
            case "FOLDER_STRUCTURE":
                return <FolderOpen className="w-4 h-4" />;
            default:
                return <FileText className="w-4 h-4" />;
        }
    };

    const getRuleDescription = (rule: DeliverableRule) => {
        switch (rule.ruleType) {
            case "MAX_SIZE_FILE":
                return `Max file size: ${
                    rule.ruleMaxSizeFile?.maxSize
                        ? (rule.ruleMaxSizeFile.maxSize / 1024 / 1024).toFixed(
                              1,
                          ) + " MB"
                        : "N/A"
                }`;
            case "FILE_PRESENCE":
                return `Required file: ${rule.ruleFilePresence?.fileName || "N/A"}`;
            case "FILE_CONTENT_MATCH":
                return `Content match in ${rule.ruleFileContentMatch?.fileName || "N/A"}: "${rule.ruleFileContentMatch?.match || "N/A"}"`;
            case "FOLDER_STRUCTURE":
                return "Custom folder structure validation";
            default:
                return "Unknown rule type";
        }
    };

    const assignedRuleIds = new Set(
        projectRules.map((pr) => pr.deliverableRule.id),
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-medium">
                        Deliverable Rules Management
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Create and manage validation rules for student
                        deliverables
                    </p>
                </div>

                <Dialog
                    open={createDialogOpen}
                    onOpenChange={setCreateDialogOpen}
                >
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Rule
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>
                                Create New Validation Rule
                            </DialogTitle>
                        </DialogHeader>
                        <CreateRuleForm
                            onSuccess={() => {
                                setCreateDialogOpen(false);
                                loadRules();
                            }}
                            onCancel={() => setCreateDialogOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <Tabs defaultValue="assigned">
                <TabsList>
                    <TabsTrigger value="assigned">
                        Assigned Rules ({projectRules.length})
                    </TabsTrigger>
                    <TabsTrigger value="available">
                        Available Rules (
                        {
                            allRules.filter((r) => !assignedRuleIds.has(r.id))
                                .length
                        }
                        )
                    </TabsTrigger>
                    <TabsTrigger value="all">
                        All Rules ({allRules.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="assigned" className="space-y-4">
                    <div className="grid gap-4">
                        {projectRules.map((projectRule) => {
                            const rule = projectRule.deliverableRule;
                            return (
                                <Card key={rule.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center space-x-3">
                                                {getRuleIcon(rule.ruleType)}
                                                <div>
                                                    <CardTitle className="text-base">
                                                        {rule.ruleType.replace(
                                                            /_/g,
                                                            " ",
                                                        )}
                                                    </CardTitle>
                                                    <p className="text-sm text-muted-foreground">
                                                        {getRuleDescription(
                                                            rule,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Badge variant="default">
                                                    Active
                                                </Badge>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleEditRule(rule)
                                                    }
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleUnassignRule(
                                                            rule.id,
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Card>
                            );
                        })}
                    </div>

                    {projectRules.length === 0 && (
                        <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
                            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-lg font-medium">
                                No rules assigned
                            </p>
                            <p className="text-muted-foreground mb-4">
                                Assign validation rules to enforce submission
                                requirements
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => setCreateDialogOpen(true)}
                            >
                                Create First Rule
                            </Button>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="available" className="space-y-4">
                    <div className="grid gap-4">
                        {allRules
                            .filter((rule) => !assignedRuleIds.has(rule.id))
                            .map((rule) => (
                                <Card key={rule.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center space-x-3">
                                                {getRuleIcon(rule.ruleType)}
                                                <div>
                                                    <CardTitle className="text-base">
                                                        {rule.ruleType.replace(
                                                            /_/g,
                                                            " ",
                                                        )}
                                                    </CardTitle>
                                                    <p className="text-sm text-muted-foreground">
                                                        {getRuleDescription(
                                                            rule,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Badge variant="secondary">
                                                    Available
                                                </Badge>
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        handleAssignRule(
                                                            rule.id,
                                                        )
                                                    }
                                                >
                                                    Assign
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleEditRule(rule)
                                                    }
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleDeleteRule(
                                                            rule.id,
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Card>
                            ))}
                    </div>

                    {allRules.filter((rule) => !assignedRuleIds.has(rule.id))
                        .length === 0 && (
                        <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
                            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-lg font-medium">
                                No available rules
                            </p>
                            <p className="text-muted-foreground mb-4">
                                All existing rules are already assigned to this
                                project
                            </p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="all" className="space-y-4">
                    <div className="grid gap-4">
                        {allRules.map((rule) => (
                            <Card key={rule.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center space-x-3">
                                            {getRuleIcon(rule.ruleType)}
                                            <div>
                                                <CardTitle className="text-base">
                                                    {rule.ruleType.replace(
                                                        /_/g,
                                                        " ",
                                                    )}
                                                </CardTitle>
                                                <p className="text-sm text-muted-foreground">
                                                    {getRuleDescription(rule)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Badge
                                                variant={
                                                    assignedRuleIds.has(rule.id)
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {assignedRuleIds.has(rule.id)
                                                    ? "Assigned"
                                                    : "Available"}
                                            </Badge>

                                            {!assignedRuleIds.has(rule.id) ? (
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        handleAssignRule(
                                                            rule.id,
                                                        )
                                                    }
                                                >
                                                    Assign
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleUnassignRule(
                                                            rule.id,
                                                        )
                                                    }
                                                >
                                                    Unassign
                                                </Button>
                                            )}

                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    handleEditRule(rule)
                                                }
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    handleDeleteRule(rule.id)
                                                }
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Edit Rule Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Validation Rule</DialogTitle>
                    </DialogHeader>
                    {selectedRule && (
                        <EditRuleForm
                            rule={selectedRule}
                            onSuccess={() => {
                                setEditDialogOpen(false);
                                setSelectedRule(null);
                                loadRules();
                            }}
                            onCancel={() => {
                                setEditDialogOpen(false);
                                setSelectedRule(null);
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};
