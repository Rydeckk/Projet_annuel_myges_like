import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExpandableCard } from "@/components/ui/expandable-card";
import { GET_COLOR_STYLES_BY_VISIBILITY } from "@/enums/ProjectVisibility";
import {
    PromotionProject,
    PromotionProjectRequest,
} from "@/types/PromotionProject";
import { format } from "date-fns";
import { Clock, Download, ExternalLink } from "lucide-react";
import { Link } from "react-router";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useContext, useMemo, useState } from "react";
import { PromotionProjectService } from "@/services/promotionProjectService/PromotionProjectService";
import { ApiException } from "@/services/api/ApiException";
import { toast } from "sonner";
import { TeacherPromotionDetailContext } from "@/pages/teacherPage/contexts/TeacherPromotionDetailContext";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { PromotionProjectFrom } from "../../forms/PromotionProjectFrom";

type Props = {
    promotionProject: PromotionProject;
};

export const PromotionProjectCard = ({ promotionProject }: Props) => {
    const { getPromotion } = useContext(TeacherPromotionDetailContext);

    const promotionProjectService = useMemo(
        () => new PromotionProjectService(),
        [],
    );

    const [open, setOpen] = useState(false);

    const project = promotionProject.project!;

    const onUpdatePromotionProject = async (data: PromotionProjectRequest) => {
        try {
            await promotionProjectService.update(promotionProject.id, data);
            getPromotion();
            setOpen(false);
            toast.success("Promotion project was successfully updated");
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    };

    const onDeletePromotionProject = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        e.stopPropagation();
        try {
            await promotionProjectService.delete(promotionProject.id);
            getPromotion();
            toast.success("The promotion project was successfully deleted");
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    };

    return (
        <div className="w-[23rem]">
            <ExpandableCard
                title={project.name}
                description={promotionProject.description ?? undefined}
                headerContent={
                    <div className="w-full flex justify-between items-center">
                        <div className="flex gap-4">
                            <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-600"
                            >
                                {promotionProject.projectGroupRule}
                            </Badge>
                            <Badge
                                variant="secondary"
                                className={
                                    GET_COLOR_STYLES_BY_VISIBILITY[
                                        project.projectVisibility
                                    ]
                                }
                            >
                                {project.projectVisibility}
                            </Badge>
                        </div>
                        <div className="flex gap-4">
                            <TooltipProvider>
                                <Tooltip>
                                    {project?.path && (
                                        <TooltipTrigger asChild>
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className="h-8 w-8"
                                                asChild
                                            >
                                                <Link
                                                    to={project.path}
                                                    target="_blank"
                                                >
                                                    <Download />
                                                </Link>
                                            </Button>
                                        </TooltipTrigger>
                                    )}
                                    <TooltipContent>
                                        <p>Download project file</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            className="h-8 w-8"
                                            asChild
                                        >
                                            <Link to={project.name}>
                                                <ExternalLink className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Project detail</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                }
                visibleChildren={
                    <div className="flex flex-col gap-2 my-2">
                        <p>{`Start date: ${format(promotionProject.startDate, "HH:mm - dd-MM-yyyy")}`}</p>
                        <p>{`End date: ${format(promotionProject.endDate, "HH:mm - dd-MM-yyyy")}`}</p>
                        <p>{`Is report required: ${promotionProject.isReportRequired}`}</p>
                        <p>{`Allow late submission: ${promotionProject.allowLateSubmission}`}</p>
                    </div>
                }
                footer={
                    <div className="flex items-center justify-between w-full text-sm text-gray-600">
                        <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{`Updated at : ${format(promotionProject.updatedAt, "HH:mm - dd-MM-yyyy")}`}</span>
                        </div>
                    </div>
                }
            >
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{`Created at : ${format(promotionProject.createdAt, "HH:mm - dd-MM-yyyy")}`}</span>
                    </div>
                </div>
                <div className="flex justify-between">
                    <Button
                        className="w-[45%]"
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpen(true);
                        }}
                    >
                        Update
                    </Button>
                    <Button
                        className="w-[45%]"
                        onClick={onDeletePromotionProject}
                    >
                        Delete
                    </Button>
                </div>
            </ExpandableCard>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent className="p-4">
                    <SheetHeader>
                        <SheetTitle>Update promotion project</SheetTitle>
                    </SheetHeader>
                    <PromotionProjectFrom
                        onSubmit={onUpdatePromotionProject}
                        promotionProject={promotionProject}
                    />
                </SheetContent>
            </Sheet>
        </div>
    );
};
