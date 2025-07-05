import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { StudentPromotionProjectContext } from "@/pages/studentPage/contexts/StudentPromotionProjectContext";
import { ApiException } from "@/services/api/ApiException";
import { ProjectGroupStudentService } from "@/services/projectGroupStudentService/ProjectGroupStudentService";
import { ProjectGroup } from "@/types/ProjectGroup";
import { getUserFullName } from "@/utils/user";
import { useContext, useMemo } from "react";
import { toast } from "sonner";

type Props = {
    projectGroup: ProjectGroup;
};

export const StudentProjectGroupCard = ({ projectGroup }: Props) => {
    const { promotionProject, getPromotionProject } = useContext(
        StudentPromotionProjectContext,
    );
    const { user } = useCurrentUser();

    const projectGroupStudentService = useMemo(
        () => new ProjectGroupStudentService(),
        [],
    );

    const projectGroupStudents = useMemo(
        () => projectGroup?.projectGroupStudents ?? [],
        [projectGroup?.projectGroupStudents],
    );

    const studentIdsWithGroup = useMemo(
        () =>
            (promotionProject?.projectGroups ?? [])?.flatMap(
                ({ projectGroupStudents }) =>
                    projectGroupStudents
                        ?.map(({ studentId }) => studentId)
                        .filter((studentId) => !!studentId) ?? [],
            ),
        [promotionProject?.projectGroups],
    );

    const studentId = user?.id;

    const isStudentGroup = projectGroupStudents.find(
        ({ student }) => student?.userId === user?.userId,
    );

    const isStudentAlreadyInAGroup = studentIdsWithGroup.includes(
        studentId ?? "",
    );

    const isMaxGroupReached =
        (promotionProject?.maxPerGroup ?? 0) > projectGroupStudents.length;

    const onJoinGroup = async () => {
        if (!studentId) return;

        try {
            await projectGroupStudentService.create({
                projectGroupId: projectGroup.id,
                promotionProjectId: projectGroup.promotionProjectId,
                studentId,
            });
            await getPromotionProject();
            toast.success(
                `You have joined the group ${projectGroup.name} successfully`,
            );
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    };

    const onLeaveGroup = async () => {
        if (!studentId) return;

        try {
            await projectGroupStudentService.delete({
                projectGroupId: projectGroup.id,
                studentId,
            });
            await getPromotionProject();
            toast.success(
                `You have left the group ${projectGroup.name} successfully`,
            );
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    };

    return (
        <Card className="w-[23rem] p-4">
            <CardTitle className="flex justify-between items-center">
                <h1>{projectGroup.name}</h1>
            </CardTitle>
            <CardContent>
                <div>
                    <ul className="list-disc list-inside">
                        {projectGroupStudents.map(({ student, studentId }) => (
                            <li key={studentId}>
                                {student?.user && getUserFullName(student.user)}
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button
                    className="w-[45%]"
                    disabled={!isMaxGroupReached || isStudentAlreadyInAGroup}
                    onClick={onJoinGroup}
                >
                    Join
                </Button>

                <Button
                    className="w-[45%]"
                    disabled={!isStudentGroup}
                    onClick={onLeaveGroup}
                >
                    Leave
                </Button>
            </CardFooter>
        </Card>
    );
};
