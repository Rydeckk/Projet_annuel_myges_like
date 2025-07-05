import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { StudentPromotionProjectContext } from "@/pages/studentPage/contexts/StudentPromotionProjectContext";
import { DeliverableService } from "@/services/deliverableService/DeliverableService";
import { Deliverable } from "@/types/Deliverable";
import { ApiException } from "@/services/api/ApiException";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DeliverableCard } from "../deliverableCard/DeliverableCard";
import { CreateDeliverableForm } from "../createDeliverableForm/CreateDeliverableForm";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export const StudentProjectDeliverable = () => {
    const { studentProjectGroup } = useContext(StudentPromotionProjectContext);
    const deliverableService = useMemo(() => new DeliverableService(), []);
    const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const getDeliverables = useCallback(async () => {
        if (!studentProjectGroup) return;

        try {
            setLoading(true);
            const data = await deliverableService.findByProjectGroup(
                studentProjectGroup.id,
            );
            setDeliverables(data);
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    }, [studentProjectGroup?.id, deliverableService]);

    useEffect(() => {
        getDeliverables();
    }, [getDeliverables]);

    const handleDeliverableCreated = () => {
        setShowCreateForm(false);
        getDeliverables();
    };

    const handleDeliverableUpdated = () => {
        getDeliverables();
    };

    const handleDeliverableDeleted = () => {
        getDeliverables();
    };

    if (!studentProjectGroup) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <p>
                    You must be part of a project group to access deliverables.
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <p>Loading deliverables...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Project Deliverables</h2>
                    <p className="text-muted-foreground">
                        Manage your project deliverables for{" "}
                        {studentProjectGroup.name}
                    </p>
                </div>
                <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Deliverable
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Deliverable</DialogTitle>
                        </DialogHeader>
                        <CreateDeliverableForm
                            projectGroupId={studentProjectGroup.id}
                            onSuccess={handleDeliverableCreated}
                            onCancel={() => setShowCreateForm(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4">
                {deliverables.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No deliverables yet.</p>
                        <p className="text-sm">
                            Create your first deliverable to get started.
                        </p>
                    </div>
                ) : (
                    deliverables.map((deliverable) => (
                        <DeliverableCard
                            key={deliverable.id}
                            deliverable={deliverable}
                            onUpdate={handleDeliverableUpdated}
                            onDelete={handleDeliverableDeleted}
                        />
                    ))
                )}
            </div>
        </div>
    );
};
