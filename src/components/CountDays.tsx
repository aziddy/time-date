import { useState, useEffect } from "react";
import { differenceInDays, format, isValid, parse } from "date-fns";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const CountDays = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [daysBetween, setDaysBetween] = useState<number | null>(null);
    const [error, setError] = useState("");

    // Calculate days between dates whenever inputs change
    useEffect(() => {
        if (startDate && endDate) {
            const start = parse(startDate, "yyyy-MM-dd", new Date());
            const end = parse(endDate, "yyyy-MM-dd", new Date());

            if (isValid(start) && isValid(end)) {
                setError("");
                const days = differenceInDays(end, start);
                setDaysBetween(days);
            } else {
                setError("Please enter valid dates");
                setDaysBetween(null);
            }
        } else {
            setDaysBetween(null);
            setError("");
        }
    }, [startDate, endDate]);

    // Set start date to today
    const handleTodayClick = () => {
        setStartDate(format(new Date(), "yyyy-MM-dd"));
    };

    return (
        <div className="space-y-6">
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <div className="flex space-x-2">
                        <Input
                            id="start-date"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
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
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                        id="end-date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                        <Button
                            type="button"
                            onClick={() => setEndDate(format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"))}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                        >
                            -30 days
                        </Button>
                        <Button
                            type="button"
                            onClick={() => setEndDate(format(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"))}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                        >
                            -14 days
                        </Button>
                        <Button
                            type="button"
                            onClick={() => setEndDate(format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"))}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                        >
                            -7 days
                        </Button>
                        <Button
                            type="button"
                            onClick={() => setEndDate(format(new Date(), "yyyy-MM-dd"))}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                        >
                            Today
                        </Button>
                        <Button
                            type="button"
                            onClick={() => setEndDate(format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"))}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                        >
                            +7 days
                        </Button>
                        <Button
                            type="button"
                            onClick={() => setEndDate(format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"))}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                        >
                            +14 days
                        </Button>
                        <Button
                            type="button"
                            onClick={() => setEndDate(format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"))}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                        >
                            +30 days
                        </Button>
                    </div>
                </div>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            {daysBetween !== null && (
                <div className="bg-gray-100 p-4 rounded-md mt-4">
                    <h3 className="font-medium text-lg mb-1">Result</h3>
                    <p className="text-2xl font-bold">
                        {daysBetween === 0
                            ? "Same day"
                            : `${Math.abs(daysBetween)} day${Math.abs(daysBetween) !== 1 ? "s" : ""
                            } ${daysBetween > 0 ? "after" : "before"}`}
                    </p>
                </div>
            )}
        </div>
    );
};

export default CountDays; 