"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui setup
import { Pause, Play } from "lucide-react";

interface TimerProps {
    initialMinutes?: number;
    onComplete: () => void;
}

const Timer: React.FC<TimerProps> = ({ initialMinutes = 5, onComplete }) => {
    const [seconds, setSeconds] = useState(initialMinutes * 60);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Core timer logic
    useEffect(() => {
        if (isRunning && seconds > 0) {
            intervalRef.current = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds - 1);
            }, 1000);
        } else if (seconds === 0 && isRunning) {
            setIsRunning(false);
            onComplete(); // Fire the onComplete hook
        }

        // Cleanup interval on component unmount or when isRunning changes
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, seconds, onComplete]);

    // Start/Pause handler
    const toggleTimer = () => {
        setIsRunning((prevIsRunning) => !prevIsRunning);
    };

    // Format time for display (e.g., 05:00)
    const formatTime = () => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(
            remainingSeconds
        ).padStart(2, "0")}`;
    };

    // Conditional styling for the timer display
    const timerColorClass = seconds < 10 ? "text-red-500" : "text-primary";

    return (
        <div className="flex items-center gap-4 p-4 border rounded-lg shadow-md w-fit">
            <div
                className={`text-4xl font-mono font-bold transition-colors duration-300 ${timerColorClass}`}
            >
                {formatTime()}
            </div>
            <Button onClick={toggleTimer} variant="outline" size="icon">
                {isRunning ? (
                    <Pause className="h-4 w-4" />
                ) : (
                    <Play className="h-4 w-4" />
                )}
                <span className="sr-only">
                    {isRunning ? "Pause" : "Start"} Timer
                </span>
            </Button>
        </div>
    );
};
export default Timer;
