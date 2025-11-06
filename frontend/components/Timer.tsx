"use client";

import { useState, useRef, useEffect } from "react";

type CountdownProps = {
    duration: number; // Duration in seconds
};

export default function Countdown({ duration }: CountdownProps) {
    // State to manage the countdown timer value
    const [timeLeft, setTimeLeft] = useState<number>(duration);
    // Reference to store the timer ID
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // useEffect hook to manage the countdown interval
    useEffect(() => {
        // If timer is 0 or no duration, don't start the timer
        if (timeLeft <= 0) {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            return;
        }
        // If the timer is active and not paused
        // Set an interval to decrease the time left
        timerRef.current = setInterval(() => {
            setTimeLeft((prevTime) => {
                // If time is up, clear the interval
                if (prevTime <= 1) {
                    clearInterval(timerRef.current!);
                    return 0;
                }
                // Decrease the time left by one second
                return prevTime - 1;
            });
        }, 1000); // Interval of 1 second
        // Cleanup function to clear the interval
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [timeLeft]); // Dependencies array to rerun the effect

    // Function to format the time left into mm:ss format
    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60); // Calculate minutes
        const seconds = time % 60; // Calculate seconds
        // Return the formatted string
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
            2,
            "0"
        )}`;
    };

    return (
        <div className="text-6xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center">
            {formatTime(timeLeft)}
        </div>
    );
}
