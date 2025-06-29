import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { MultiSelect } from "@/components/ui/multi-select";
import { TeacherPromotionDetailContext } from "@/pages/teacherPage/contexts/TeacherPromotionDetailContext";
import { TeacherPromotionProjectDetailContext } from "@/pages/teacherPage/contexts/TeacherPromotionProjectDetailContext";
import { ApiException } from "@/services/api/ApiException";
import { ProjectGroupService } from "@/services/projectGroupService/ProjectGroupService";
import { ProjectGroup } from "@/types/ProjectGroup";
import { ProjectGroupStudent } from "@/types/ProjectGroupStudent";
import { SetState } from "@/types/React";
import { getUserFullName } from "@/utils/user";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Props = {
    open: boolean;
    setOpen: SetState<boolean>;
    projectGroup: ProjectGroup;
    projectGroupStudents: ProjectGroupStudent[];
};

export const ProjectGroupStudentWithAction = ({
    open,
    setOpen,
    projectGroup,
    projectGroupStudents,
}: Props) => {
    const { promotion } = useContext(TeacherPromotionDetailContext);
    const { promotionProject, projectGroups, getPromotionProject } = useContext(
        TeacherPromotionProjectDetailContext,
    );

    const projectGroupService = useMemo(() => new ProjectGroupService(), []);

    const projectGroupStudentIds = useMemo(
        () =>
            projectGroupStudents.map(
                (projectGroupStudent) => projectGroupStudent.studentId,
            ),
        [projectGroupStudents],
    );

    const promotionStudentsOptions = useMemo(
        () =>
            (promotion?.promotionStudents ?? []).map((promotionStudent) => ({
                value: promotionStudent.studentId,
                label: promotionStudent.student?.user
                    ? getUserFullName(promotionStudent.student.user)
                    : "",
            })),
        [promotion?.promotionStudents],
    );

    const studentIdsWithGroup = useMemo(
        () =>
            projectGroups.flatMap(
                ({ projectGroupStudents }) =>
                    projectGroupStudents
                        ?.map(({ studentId }) => studentId)
                        .filter((studentId) => !!studentId) ?? [],
            ),
        [projectGroups],
    );

    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(
        projectGroupStudentIds,
    );

    const updateProjectGroupStudents = async () => {
        try {
            await projectGroupService.update(projectGroup.id, {
                selectedProjectGroupStudentIds: selectedStudentIds,
            });
            await getPromotionProject();
            toast.success("Project group was successfully updated");
            setOpen(false);
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    };

    const resetState = useCallback(() => {
        setSelectedStudentIds(projectGroupStudentIds);
    }, [projectGroupStudentIds]);

    useEffect(() => {
        resetState();
    }, [resetState]);

    return (
        <div className="">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent
                    className="sm:max-w-[425px]"
                    onInteractOutside={resetState}
                    onEscapeKeyDown={resetState}
                >
                    <DialogHeader>
                        <DialogTitle>Edit students group</DialogTitle>
                    </DialogHeader>
                    <MultiSelect
                        options={promotionStudentsOptions.filter(
                            ({ value }) =>
                                projectGroupStudentIds.includes(value) ||
                                !studentIdsWithGroup.includes(value),
                        )}
                        onValueChange={setSelectedStudentIds}
                        defaultValue={selectedStudentIds}
                        placeholder="Select student"
                        variant="inverted"
                        animation={2}
                        maxDisplayCount={3}
                        maxSelection={promotionProject?.maxPerGroup}
                        maxSelectionMessage={`You can't select more than ${promotionProject?.maxPerGroup} students`}
                        modalPopover
                    />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            onClick={updateProjectGroupStudents}
                        >
                            Save changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {projectGroupStudentIds.length > 0 && (
                <div>
                    <ul className="list-disc list-inside">
                        {promotionStudentsOptions
                            .filter(({ value }) =>
                                projectGroupStudentIds.includes(value),
                            )
                            .map(({ value, label }) => (
                                <li key={value}>{label}</li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
