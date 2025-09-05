"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
const Homepage = () => {
    const router = useRouter();

    useEffect(() => {
        // Redirect to login page on mount
        router.push("/login");
    }, []);

    return <div></div>;
};

export default Homepage;
