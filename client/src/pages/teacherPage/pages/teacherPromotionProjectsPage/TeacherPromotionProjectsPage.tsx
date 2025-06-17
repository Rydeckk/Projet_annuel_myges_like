import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { PromotionDetailContext } from "@/contexts/PromotionDetailContext";
import { CirclePlus } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router";
import { PromotionProjectFrom } from "./forms/PromotionProjectFrom";

export const TeacherPromotionProjectsPage = () => {
    const { promotion } = useContext(PromotionDetailContext);
    const [open, setOpen] = useState(false);

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
                                to="/teacher/project"
                            >
                                Project management
                            </Link>
                        </SheetDescription>
                    </SheetHeader>
                    <PromotionProjectFrom />
                </SheetContent>
            </Sheet>
        </div>
    );
};
