import { useState, useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

// Initialize dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Common timezones
const TIMEZONES = [
    { value: "America/New_York", label: "New York (EST/EDT)" },
    { value: "America/Chicago", label: "Chicago (CST/CDT)" },
    { value: "America/Denver", label: "Denver (MST/MDT)" },
    { value: "America/Los_Angeles", label: "Los Angeles (PST/PDT)" },
    { value: "Europe/London", label: "London (GMT/BST)" },
    { value: "Europe/Paris", label: "Paris (CET/CEST)" },
    { value: "Europe/Berlin", label: "Berlin (CET/CEST)" },
    { value: "Asia/Tokyo", label: "Tokyo (JST)" },
    { value: "Asia/Shanghai", label: "Shanghai (CST)" },
    { value: "Asia/Kolkata", label: "India (IST)" },
    { value: "Australia/Sydney", label: "Sydney (AEST/AEDT)" },
    { value: "Pacific/Auckland", label: "Auckland (NZST/NZDT)" },
];

const TimezoneConverter = () => {
    const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [time, setTime] = useState(format(new Date(), "HH:mm"));
    const [sourceTimezone, setSourceTimezone] = useState("America/New_York");
    const [targetTimezone, setTargetTimezone] = useState("Asia/Kolkata");
    const [convertedTime, setConvertedTime] = useState("");

    useEffect(() => {
        convertTime();
    }, [date, time, sourceTimezone, targetTimezone]);

    const convertTime = () => {
        if (!date || !time || !sourceTimezone || !targetTimezone) return;

        try {
            // Create a dayjs object with the source timezone
            const sourceTime = dayjs.tz(`${date} ${time}`, sourceTimezone);

            if (!sourceTime.isValid()) {
                setConvertedTime("Invalid date/time");
                return;
            }

            // Convert to target timezone
            const targetTime = sourceTime.tz(targetTimezone);

            // Format the result
            setConvertedTime(
                targetTime.format("YYYY-MM-DD HH:mm:ss (ddd)")
            );
        } catch {
            setConvertedTime("Error converting time");
        }
    };

    const handleTodayClick = () => {
        const now = new Date();
        setDate(format(now, "yyyy-MM-dd"));
        setTime(format(now, "HH:mm"));
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <div className="flex space-x-2">
                        <Input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                        <Button type="button" onClick={handleTodayClick}>
                            Today
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                        id="time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="source-timezone">From Timezone</Label>
                    <Select
                        value={sourceTimezone}
                        onValueChange={(value) => setSourceTimezone(value)}
                    >
                        <SelectTrigger id="source-timezone">
                            <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                            {TIMEZONES.map((tz) => (
                                <SelectItem key={tz.value} value={tz.value}>
                                    {tz.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="target-timezone">To Timezone</Label>
                    <Select
                        value={targetTimezone}
                        onValueChange={(value) => setTargetTimezone(value)}
                    >
                        <SelectTrigger id="target-timezone">
                            <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                            {TIMEZONES.map((tz) => (
                                <SelectItem key={tz.value} value={tz.value}>
                                    {tz.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {convertedTime && (
                <div className="bg-gray-100 p-4 rounded-md mt-4">
                    <h3 className="font-medium text-lg mb-1">Converted Time</h3>
                    <p className="text-2xl font-bold">{convertedTime}</p>
                </div>
            )}
        </div>
    );
};

export default TimezoneConverter; 