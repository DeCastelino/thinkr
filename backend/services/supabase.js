import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.DB_URL;
const supabaseKey = process.env.DB_API_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error(
        "Supabase URL and Key must be provided in environment variables."
    );
}
// Create and export Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Admin client with service role key for elevated privileges
export const supabaseAdmin = createClient(
    supabaseUrl,
    process.env.DB_SERVICE_KEY
);
