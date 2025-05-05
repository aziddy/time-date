import { useState, useEffect } from "react";
import { format, add, isValid, parse } from "date-fns";
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

const AddDays = () => {
    const [startDate, setStartDate] = useState("");
    const [operation, setOperation] = useState<"add" | "subtract">("add");
    const [years, setYears] = useState<number | "">(0);
    const [months, setMonths] = useState<number | "">(0);
    const [weeks, setWeeks] = useState<number | "">(0);
    const [days, setDays] = useState<number | "">(0);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        calculateDate();
    }, [startDate, operation, years, months, weeks, days]);

    const calculateDate = () => {
        if (!startDate) {
            setResult(null);
            setError("");
            return;
        }

        try {
            const start = parse(startDate, "yyyy-MM-dd", new Date());

            if (!isValid(start)) {
                setError("Please enter a valid date");
                setResult(null);
                return;
            }

            // Check that at least one period is set
            if (
                (years === 0 || years === "") &&
                (months === 0 || months === "") &&
                (weeks === 0 || weeks === "") &&
                (days === 0 || days === "")
            ) {
                setResult(format(start, "EEEE, MMMM d, yyyy"));
                return;
            }

            // Calculate the new date
            const duration = {
                years: years || 0,
                months: months || 0,
                weeks: weeks || 0,
                days: days || 0,
            };

            let resultDate;
            if (operation === "add") {
                resultDate = add(start, duration);
            } else {
                // For subtraction, negate the duration values
                resultDate = add(start, {
                    years: -(duration.years),
                    months: -(duration.months),
                    weeks: -(duration.weeks),
                    days: -(duration.days),
                });
            }

            setResult(format(resultDate, "EEEE, MMMM d, yyyy"));
            setError("");
        } catch {
            setError("Error calculating date");
            setResult(null);
        }
    };

    const handleTodayClick = () => {
        setStartDate(format(new Date(), "yyyy-MM-dd"));
    };

    // Helper to handle number input changes
    const handleNumberChange = (
        setValue: (value: number | "") => void,
        value: string
    ) => {
        if (value === "") {
            setValue("");
        } else {
            const num = parseInt(value, 10);
            if (!isNaN(num) && num >= 0) {
                setValue(num);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <Label htmlFor="operation">Operation</Label>
                    <Select
                        value={operation}
                        onValueChange={(value) => setOperation(value as "add" | "subtract")}
                    >
                        <SelectTrigger id="operation">
                            <SelectValue placeholder="Select operation" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="add">Add</SelectItem>
                            <SelectItem value="subtract">Subtract</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="years">Years</Label>
                    <Input
                        id="years"
                        type="number"
                        min="0"
                        value={years}
                        onChange={(e) =>
                            handleNumberChange(setYears, e.target.value)
                        }
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="months">Months</Label>
                    <Input
                        id="months"
                        type="number"
                        min="0"
                        value={months}
                        onChange={(e) =>
                            handleNumberChange(setMonths, e.target.value)
                        }
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="weeks">Weeks</Label>
                    <Input
                        id="weeks"
                        type="number"
                        min="0"
                        value={weeks}
                        onChange={(e) =>
                            handleNumberChange(setWeeks, e.target.value)
                        }
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="days">Days</Label>
                    <Input
                        id="days"
                        type="number"
                        min="0"
                        value={days}
                        onChange={(e) =>
                            handleNumberChange(setDays, e.target.value)
                        }
                    />
                </div>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            {result && (
                <div className="bg-gray-100 p-4 rounded-md mt-4">
                    <h3 className="font-medium text-lg mb-1">Result</h3>
                    <p className="text-2xl font-bold">{result}</p>
                </div>
            )}
        </div>
    );
};

export default AddDays; 