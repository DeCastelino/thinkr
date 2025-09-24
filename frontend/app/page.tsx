"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createClient } from "@/app/utils/supabase/client";
import axios from "axios";

const Homepage = () => {
    const router = useRouter();

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                // Get the session to check the user is authenticated
                const {
                    data: { session },
                } = await createClient().auth.getSession();

                if (!session) {
                    // Redirect to login page on mount
                    console.log("User not authenticated");
                    router.push("/login");
                } else {
                    router.push("/create-quiz");
                }
            } catch (error) {
                console.error("Error checking login:", error);
            }
        };

        checkLoggedIn();
    }, []);

    return <div></div>;
};

export default Homepage;
