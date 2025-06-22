import { useState } from "react";
import { format, set } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";

export const DateAndTime = () => {
    const [open, setOpen] = useState(false);
    const [dateTime, setDateTime] = useState<Date | undefined>(undefined);

    const timeString = dateTime ? format(dateTime, "HH:mm:ss") : "00:00:00";

    const handleDateChange = (selected: Date | undefined) => {
        if (!selected) return;

        const current = dateTime ?? new Date();
        const updated = set(selected, {
            hours: current.getHours(),
            minutes: current.getMinutes(),
            seconds: current.getSeconds(),
        });

        setDateTime(updated);
        setOpen(false);
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const current = dateTime ?? new Date();

        const [hours, minutes, seconds] = e.target.value.split(":").map(Number);

        const updated = set(current, {
            hours,
            minutes,
            seconds: seconds ?? 0,
        });

        setDateTime(updated);
    };

    return (
        <div className="flex gap-4">
            <div className="flex flex-col gap-3">
                <Label htmlFor="date-picker" className="px-1">
                    Date
                </Label>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            id="date-picker"
                            className="w-32 justify-between font-normal"
                        >
                            {dateTime
                                ? format(dateTime, "dd/MM/yyyy")
                                : "Select date"}
                            <ChevronDownIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                    >
                        <Calendar
                            mode="single"
                            selected={dateTime}
                            captionLayout="dropdown"
                            onSelect={handleDateChange}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="flex flex-col gap-3">
                <Label htmlFor="time-picker" className="px-1">
                    Time
                </Label>
                <Input
                    type="time"
                    id="time-picker"
                    step="1"
                    value={timeString}
                    onChange={handleTimeChange}
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
            </div>
        </div>
    );
};
