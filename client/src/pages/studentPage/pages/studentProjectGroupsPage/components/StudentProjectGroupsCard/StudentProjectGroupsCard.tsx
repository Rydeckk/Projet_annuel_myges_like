import { Table } from "@/components/table/Table";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { PromotionProjectContext } from "@/pages/studentPage/context/PromotionProjectContext";
import { ProjectGroup } from "@/types/ProjectGroup";
import { User } from "@/types/User";
import { ColumnDef } from "@tanstack/react-table";
import { useContext } from "react";

type StudentProjectGroupsCardProps = {
    projectGroup: ProjectGroup;
};

export const StudentProjectGroupsCard = ({
    projectGroup,
}: StudentProjectGroupsCardProps) => {
    const { promotionProject } = useContext(PromotionProjectContext);

    const students = projectGroup.projectGroupStudents?.map(
        (pgs) => pgs.student?.user,
    ) as User[];

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: "firstName",
            header: "First Name",
            cell: ({ row }) => <p>{row.getValue("firstName")}</p>,
        },
        {
            accessorKey: "lastName",
            header: "Last Name",
            cell: ({ row }) => <p>{row.getValue("lastName")}</p>,
        },
    ];

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>{projectGroup.name}</CardTitle>
                    <CardDescription className="text-ellipsis line-clamp-4"></CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Min per group {promotionProject?.minPerGroup} - Max per
                        group {promotionProject?.maxPerGroup}
                    </p>
                    <Table
                        data={students || []}
                        columns={columns}
                        tableHeader={
                            <CardTitle className="text-lg font-semibold">
                                Members
                            </CardTitle>
                        }
                    />
                </CardContent>
                <CardFooter className="flex gap-4">
                    <Button>Join Group</Button>
                    <Button>Left Group</Button>
                </CardFooter>
            </Card>
        </>
    );
};
