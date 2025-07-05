import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Download,
    FileText,
    Search,
    CheckCircle,
    XCircle,
    Calendar,
    User,
    Archive,
} from "lucide-react";
import { DeliverableService } from "@/services/deliverableService/DeliverableService";
import type { SubmissionStatus } from "@/services/teacherDashboardService/TeacherDashboardService";
import type { Deliverable } from "@/types/Deliverable";

interface TeacherDeliverableListProps {
    promotionProjectId: string;
    submissions: SubmissionStatus[];
}

export const TeacherDeliverableList = ({
    submissions,
}: TeacherDeliverableListProps) => {
    const [deliverables, setDeliverables] = useState<
        (Deliverable & {
            groupName: string;
            studentName: string;
            studentEmail: string;
        })[]
    >([]);
    const [filteredDeliverables, setFilteredDeliverables] = useState<
        typeof deliverables
    >([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [groupFilter, setGroupFilter] = useState("all");

    const deliverableService = new DeliverableService();

    const loadDeliverables = async () => {
        setLoading(true);
        try {
            const allDeliverables: typeof deliverables = [];

            for (const submission of submissions) {
                for (const deliverable of submission.deliverables) {
                    try {
                        const fullDeliverable =
                            await deliverableService.findOne(deliverable.id);
                        allDeliverables.push({
                            ...fullDeliverable,
                            groupName: submission.groupName,
                            studentName:
                                submission.students[0]?.name || "Unknown",
                            studentEmail: submission.students[0]?.email || "",
                        });
                    } catch (error) {
                        console.error(
                            `Error loading deliverable ${deliverable.id}:`,
                            error,
                        );
                    }
                }
            }

            setDeliverables(allDeliverables);
        } catch (error) {
            console.error("Error loading deliverables:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDeliverables();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submissions]);

    const filterDeliverables = () => {
        let filtered = [...deliverables];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(
                (d) =>
                    d.groupName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    d.studentName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    d.name.toLowerCase().includes(searchTerm.toLowerCase()),
            );
        }

        // Status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter((d) => {
                const isCompliant = d.id && Math.random() > 0.3; // Mock compliance check
                return statusFilter === "compliant"
                    ? isCompliant
                    : !isCompliant;
            });
        }

        // Group filter
        if (groupFilter !== "all") {
            filtered = filtered.filter((d) => d.groupName === groupFilter);
        }

        setFilteredDeliverables(filtered);
    };

    useEffect(() => {
        filterDeliverables();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deliverables, searchTerm, statusFilter, groupFilter]);

    const loadDeliverables = async () => {
        setLoading(true);
        try {
            const allDeliverables: typeof deliverables = [];

            for (const submission of submissions) {
                for (const deliverable of submission.deliverables) {
                    try {
                        const fullDeliverable =
                            await deliverableService.findOne(deliverable.id);
                        allDeliverables.push({
                            ...fullDeliverable,
                            groupName: submission.groupName,
                            studentName:
                                submission.students[0]?.name || "Unknown",
                            studentEmail: submission.students[0]?.email || "",
                        });
                    } catch (error) {
                        console.error(
                            `Error loading deliverable ${deliverable.id}:`,
                            error,
                        );
                    }
                }
            }

            setDeliverables(allDeliverables);
        } catch (error) {
            console.error("Error loading deliverables:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterDeliverables = () => {
        let filtered = [...deliverables];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(
                (d) =>
                    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    d.groupName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    d.studentName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()),
            );
        }

        // Status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter((d) => {
                const hasFile = d.deliverableArchive || d.deliverableGitRepo;
                const isSubmitted = !!d.submitAt;

                switch (statusFilter) {
                    case "submitted":
                        return isSubmitted;
                    case "with-files":
                        return hasFile;
                    case "without-files":
                        return !hasFile;
                    case "late":
                        return d.isLateSubmission;
                    default:
                        return true;
                }
            });
        }

        // Group filter
        if (groupFilter !== "all") {
            filtered = filtered.filter((d) => d.groupName === groupFilter);
        }

        setFilteredDeliverables(filtered);
    };

    const handleDownload = async (deliverable: Deliverable) => {
        try {
            const downloadInfo = await deliverableService.downloadArchive(
                deliverable.id,
            );
            // Create download link
            const link = document.createElement("a");
            link.href = downloadInfo.url;
            link.download = downloadInfo.filename || `${deliverable.name}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading deliverable:", error);
        }
    };

    const handleBulkDownload = async () => {
        const deliverablesWithFiles = filteredDeliverables.filter(
            (d) => d.deliverableArchive || d.deliverableGitRepo,
        );

        for (const deliverable of deliverablesWithFiles) {
            try {
                await handleDownload(deliverable);
                // Add delay to avoid overwhelming the server
                await new Promise((resolve) => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`Error downloading ${deliverable.name}:`, error);
            }
        }
    };

    const uniqueGroups = Array.from(
        new Set(submissions.map((s) => s.groupName)),
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Filters and Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search deliverables, groups, or students..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="with-files">
                                With Files
                            </SelectItem>
                            <SelectItem value="without-files">
                                No Files
                            </SelectItem>
                            <SelectItem value="late">
                                Late Submission
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={groupFilter} onValueChange={setGroupFilter}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Group" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Groups</SelectItem>
                            {uniqueGroups.map((group) => (
                                <SelectItem key={group} value={group}>
                                    {group}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button onClick={handleBulkDownload} variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Bulk Download
                    </Button>
                </div>
            </div>

            {/* Results Summary */}
            <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                    Showing {filteredDeliverables.length} of{" "}
                    {deliverables.length} deliverables
                </p>
            </div>

            {/* Deliverables Grid */}
            <div className="grid gap-4">
                {filteredDeliverables.map((deliverable) => (
                    <Card key={deliverable.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg">
                                        {deliverable.name}
                                    </CardTitle>
                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                        <div className="flex items-center space-x-1">
                                            <User className="w-4 h-4" />
                                            <span>
                                                {deliverable.studentName}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <User className="w-4 h-4" />
                                            <span>{deliverable.groupName}</span>
                                        </div>
                                        {deliverable.submitAt && (
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    {new Date(
                                                        deliverable.submitAt,
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    {/* Status badges */}
                                    {deliverable.submitAt ? (
                                        <Badge variant="default">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Submitted
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary">
                                            <XCircle className="w-3 h-3 mr-1" />
                                            Not Submitted
                                        </Badge>
                                    )}

                                    {deliverable.isLateSubmission && (
                                        <Badge variant="destructive">
                                            Late
                                        </Badge>
                                    )}

                                    {(deliverable.deliverableArchive ||
                                        deliverable.deliverableGitRepo) && (
                                        <Badge variant="outline">
                                            <Archive className="w-3 h-3 mr-1" />
                                            Has Files
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-3">
                                {deliverable.description && (
                                    <p className="text-sm text-muted-foreground">
                                        {deliverable.description}
                                    </p>
                                )}

                                {/* File information */}
                                {deliverable.deliverableArchive && (
                                    <div className="p-3 bg-muted rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium text-sm">
                                                    Archive File
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {
                                                        deliverable
                                                            .deliverableArchive
                                                            .name
                                                    }
                                                    {deliverable
                                                        .deliverableArchive
                                                        .fileSize &&
                                                        ` (${Math.round((deliverable.deliverableArchive.fileSize / 1024 / 1024) * 100) / 100} MB)`}
                                                </p>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    handleDownload(deliverable)
                                                }
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                Download
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {deliverable.deliverableGitRepo && (
                                    <div className="p-3 bg-muted rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium text-sm">
                                                    Git Repository
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {
                                                        deliverable
                                                            .deliverableGitRepo
                                                            .repositoryUrl
                                                    }
                                                    {deliverable
                                                        .deliverableGitRepo
                                                        .branch &&
                                                        ` (${deliverable.deliverableGitRepo.branch})`}
                                                </p>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    window.open(
                                                        deliverable
                                                            .deliverableGitRepo
                                                            ?.repositoryUrl,
                                                        "_blank",
                                                    )
                                                }
                                            >
                                                <FileText className="w-4 h-4 mr-2" />
                                                Open Repo
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {!deliverable.deliverableArchive &&
                                    !deliverable.deliverableGitRepo && (
                                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <p className="text-sm text-yellow-800">
                                                No files attached to this
                                                deliverable
                                            </p>
                                        </div>
                                    )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredDeliverables.length === 0 && (
                <div className="text-center py-8">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">No deliverables found</p>
                    <p className="text-muted-foreground">
                        Try adjusting your search criteria or filters
                    </p>
                </div>
            )}
        </div>
    );
};
