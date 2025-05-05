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
    { value: "America/New_York", label: "New York (EST/EDT)", country: "USA" },
    { value: "America/Chicago", label: "Chicago (CST/CDT)", country: "USA" },
    { value: "America/Denver", label: "Denver (MST/MDT)", country: "USA" },
    { value: "America/Los_Angeles", label: "Los Angeles (PST/PDT)", country: "USA" },
    { value: "Europe/London", label: "London (GMT/BST)", country: "UK" },
    { value: "Europe/Paris", label: "Paris (CET/CEST)", country: "FR" },
    { value: "Europe/Berlin", label: "Berlin (CET/CEST)", country: "DE" },
    { value: "Europe/Munich", label: "Munich (CET/CEST)", country: "DE" },
    { value: "Europe/Frankfurt", label: "Frankfurt (CET/CEST)", country: "DE" },
    { value: "Asia/Tokyo", label: "Tokyo (JST)", country: "JP" },
    { value: "Asia/Shanghai", label: "Shanghai (CST)", country: "CN" },
    { value: "Asia/Kolkata", label: "India (IST)", country: "IN" },
    { value: "Australia/Sydney", label: "Sydney (AEST/AEDT)", country: "AU" },
    { value: "Pacific/Auckland", label: "Auckland (NZST/NZDT)", country: "NZ" },
];

const TimezoneConverter = () => {
    const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [time, setTime] = useState(format(new Date(), "HH:mm"));
    const [sourceTimezone, setSourceTimezone] = useState("America/New_York");
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