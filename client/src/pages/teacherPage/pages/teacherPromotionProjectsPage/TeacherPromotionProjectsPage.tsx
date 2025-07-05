import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { TeacherPromotionDetailContext } from "@/pages/teacherPage/contexts/TeacherPromotionDetailContext";
import { CirclePlus } from "lucide-react";
import { useContext, useMemo, useState } from "react";
import { Link } from "react-router";
import { PromotionProjectFrom } from "./forms/PromotionProjectFrom";
import { PromotionProjectService } from "@/services/promotionProjectService/PromotionProjectService";
import { PromotionProjectRequest } from "@/types/PromotionProject";
import { ApiException } from "@/services/api/ApiException";
import { toast } from "sonner";
import { PromotionProjectCard } from "./components/promotionProjectCard/PromotionProjectCard";

export const TeacherPromotionProjectsPage = () => {
    const { promotion, getPromotion } = useContext(
        TeacherPromotionDetailContext,
    );

    const promotionProjectService = useMemo(
        () => new PromotionProjectService(),
        [],
    );
    const [open, setOpen] = useState(false);

    const onCreatePromotionProject = async (data: PromotionProjectRequest) => {
        try {
            await promotionProjectService.create(data);
            getPromotion();
            setOpen(false);
            toast.success("The promotion project was successfully created");
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between py-4">
                <div>
                    <h1 className="text-2xl font-bold">Promotion Projects</h1>
                    <h2 className="text-1xl font-bold">{`Promotion: ${promotion?.name}`}</h2>
                </div>
                <div className="ml-auto flex gap-4">
                    <Button
                        className="ml-auto"
                        variant="outline"
                        onClick={() => setOpen(true)}
                    >
                        <CirclePlus />
                        Assign project to promotion
                    </Button>
                </div>
            </div>

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent className="p-4">
                    <SheetHeader>
                        <SheetTitle>Assign project to promotion</SheetTitle>
                        <SheetDescription>
                            You can assign a project to promotion and if the
                            project is not created yet: <br /> Go to {"-> "}
                            <Link
                                className="font-bold underline text-blue-400"
                                to="/teacher/projects"
                            >
                                Project management
                            </Link>
                        </SheetDescription>
                    </SheetHeader>
                    <PromotionProjectFrom onSubmit={onCreatePromotionProject} />
                </SheetContent>
            </Sheet>

            <div className="flex gap-4 mt-6 flex-wrap">
                {promotion?.promotionProjects?.map((promotionProject) => (
                    <PromotionProjectCard
                        key={promotionProject.id}
                        promotionProject={promotionProject}
                    />
                ))}
            </div>
        </div>
    );
};
