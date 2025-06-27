import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { ReportSection } from "@/types/ReportSection";
import { Report, ReportUpdateRequest } from "@/types/Report";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";
import { z } from "zod";

const schema = z.object({
    content: z.string().optional(),
});

type StudentProjectDeliverableReportCardProps = {
    reportSection: ReportSection;
    onSave: (
        content: string,
        reportSection: ReportSection,
        report?: Report,
    ) => void;
    report?: Report;
};

export const StudentProjectDeliverableReportCard = ({
    reportSection,
    onSave,
    report,
}: StudentProjectDeliverableReportCardProps) => {
    const {
        watch,
        control,
        formState: { errors },
    } = useForm<ReportUpdateRequest>({
        resolver: zodResolver(schema),
        defaultValues: {
            content: report?.content ?? "",
        },
    });

    const watchedContent = watch("content");
    const [debouncedContent] = useDebounce(watchedContent, 500);

    const lastSentValuesRef = useRef<ReportUpdateRequest>({
        content: report?.content ?? "",
    });

    useEffect(() => {
        const values = {
            content: debouncedContent,
        };

        const result = schema.safeParse(values);
        if (result.success) {
            const lastSent = lastSentValuesRef.current;
            const hasChanged =
                JSON.stringify(lastSent) !== JSON.stringify(result.data);

            if (hasChanged) {
                lastSentValuesRef.current = result.data;
                onSave(result.data.content ?? "", reportSection, report);
            }
        }
    }, [debouncedContent, onSave, report, reportSection]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{reportSection.title}</CardTitle>
                <CardDescription>
                    {reportSection.description || "No description provided."}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
                <div className="flex flex-col flex-grow-1 gap-2">
                    <div className="flex flex-col gap-2">
                        <Controller
                            name="content"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <div className="flex flex-col gap-2">
                                    <MDEditor
                                        data-color-mode="light"
                                        id="content"
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        className="min-h-[300px] w-full border rounded p-2"
                                    />
                                    <p className="text-red-500">
                                        {errors.content?.message}
                                    </p>
                                </div>
                            )}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
