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

// Common timezones with country codes
const TIMEZONES = [
    { value: "America/Toronto", label: "Toronto (EST/EDT) GMT-5/-4", country: "🇨🇦CAN" },
    { value: "Europe/London", label: "London (GMT/BST) GMT+0/+1", country: "🇬🇧UK" },
    { value: "Europe/Berlin", label: "Germany/Berlin (CET/CEST) GMT+1/+2", country: "🇩🇪DE" },
    { value: "Asia/Kolkata", label: "India (IST) GMT+5:30", country: "🇮🇳IN" },
    { value: "America/Chicago", label: "Chicago (CST/CDT) GMT-6/-5", country: "🇺🇸USA" },
    { value: "America/Denver", label: "Denver (MST/MDT) GMT-7/-6", country: "🇺🇸USA" },
    { value: "America/Los_Angeles", label: "Los Angeles (PST/PDT) GMT-8/-7", country: "🇺🇸USA" },
    { value: "Europe/Paris", label: "Paris (CET/CEST) GMT+1/+2", country: "🇫🇷FR" },
    { value: "Asia/Tokyo", label: "Tokyo (JST) GMT+9", country: "🇯🇵JP" },
    { value: "Asia/Shanghai", label: "Shanghai (CST) GMT+8", country: "🇨🇳CN" },
    { value: "Australia/Sydney", label: "Sydney (AEST/AEDT) GMT+10/+11", country: "🇦🇺AU" },
    { value: "Pacific/Auckland", label: "Auckland (NZST/NZDT) GMT+12/+13", country: "🇳🇿NZ" },
];

const TimezoneConverter = () => {
    const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [time, setTime] = useState(format(new Date(), "HH:mm"));
    const [sourceTimezone, setSourceTimezone] = useState("America/Toronto");
    const [targetTimezone, setTargetTimezone] = useState("Asia/Kolkata");
    const [convertedTime, setConvertedTime] = useState<{
        date: string;
        time24: string;
        time12: string;
        hoursDiff: number;
    } | null>(null);

    useEffect(() => {
        convertTime();
    }, [date, time, sourceTimezone, targetTimezone]);

    const getTimezoneLabel = (value: string): string => {
        const timezone = TIMEZONES.find(tz => tz.value === value);
        if (!timezone) return value;
        return `${timezone.country}/${timezone.label.split(" ")[0]}`;
    };

    const calculateTimeDifference = (sourceTime: dayjs.Dayjs, targetTime: dayjs.Dayjs): number => {
        // Get the UTC offset for both timezones in minutes
        const sourceOffset = sourceTime.utcOffset();
        const targetOffset = targetTime.utcOffset();

        // Calculate the difference in hours
        return (targetOffset - sourceOffset) / 60;
    };

    const formatTimeDifference = (hoursDiff: number): string => {
        const absHours = Math.abs(hoursDiff);
        const hourText = absHours === 1 ? "hour" : "hours";

        if (hoursDiff === 0) {
            return "same time";
        } else if (hoursDiff > 0) {
            return `${absHours} ${hourText} ahead`;
        } else {
            return `${absHours} ${hourText} behind`;
        }
    };

    const convertTime = () => {
        if (!date || !time || !sourceTimezone || !targetTimezone) {
            setConvertedTime(null);
            return;
        }

        try {
            // Create a dayjs object with the source timezone
            const sourceTime = dayjs.tz(`${date} ${time}`, sourceTimezone);

            if (!sourceTime.isValid()) {
                setConvertedTime(null);
                return;
            }

            // Convert to target timezone
            const targetTime = sourceTime.tz(targetTimezone);

            // Calculate hours difference between timezones
            const hoursDiff = calculateTimeDifference(sourceTime, targetTime);

            // Format the result in different formats
            setConvertedTime({
                date: targetTime.format("YYYY-MM-DD (ddd)"),
                time24: targetTime.format("HH:mm:ss"),
                time12: targetTime.format("h:mm A"),
                hoursDiff: hoursDiff
            });
        } catch {
            setConvertedTime(null);
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
                        <Button
                            type="button"
                            onClick={handleTodayClick}
                            variant="secondary"
                            className="font-semibold shadow-md border border-gray-300"
                        >
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
                                    {tz.country}/{tz.label}
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
                                    {tz.country}/{tz.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {convertedTime && (
                <div className="bg-gray-100 p-4 rounded-md mt-4">
                    <h3 className="font-medium text-lg mb-1">Converted Time</h3>
                    <div className="space-y-1">
                        <p className="text-xl font-bold">{convertedTime.date}</p>
                        <p className="text-lg">{convertedTime.time24}</p>
                        <p className="text-lg">{convertedTime.time12}</p>
                        <p className="text-sm text-gray-600 mt-2">
                            ({getTimezoneLabel(sourceTimezone)} → {getTimezoneLabel(targetTimezone)})
                        </p>
                        <p className="text-sm font-medium text-primary">
                            {formatTimeDifference(convertedTime.hoursDiff)}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimezoneConverter; 