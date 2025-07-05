import { useRef, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { useExpandable } from "@/hooks/use-expandable";

interface ProjectStatusCardProps {
    title: string;
    description?: string;
    headerContent?: ReactNode;
    visibleChildren?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    disabled?: boolean;
}

export const ExpandableCard = ({
    title,
    description = undefined,
    headerContent,
    visibleChildren,
    children,
    footer,
    disabled = false,
}: ProjectStatusCardProps) => {
    const { isExpanded, toggleExpand, animatedHeight } =
        useExpandable(disabled);

    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            animatedHeight.set(
                isExpanded ? contentRef.current.scrollHeight : 0,
            );
        }
    }, [isExpanded, animatedHeight]);

    return (
        <Card
            className="w-full max-w-md cursor-pointer transition-all duration-300 hover:shadow-lg gap-0"
            onClick={() => {
                if (disabled) {
                    return;
                }
                toggleExpand();
            }}
        >
            <CardHeader className="space-y-1">
                {headerContent}
                <div className="flex flex-col gap-2 mb-2 w-full">
                    <h3 className="text-2xl font-semibold">{title}</h3>
                    {description && (
                        <CardDescription className="text-ellipsis line-clamp-4">
                            {description}
                        </CardDescription>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                {visibleChildren && visibleChildren}
                <motion.div
                    style={{ height: animatedHeight }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                    }}
                    className="overflow-hidden"
                >
                    <div ref={contentRef}>
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-4 pt-2"
                                >
                                    {children}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </CardContent>

            {footer && <CardFooter className="mt-4">{footer}</CardFooter>}
        </Card>
    );
};
