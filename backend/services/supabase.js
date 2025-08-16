import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });

const supabaseUrl = process.env.DB_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error(
        "Supabase URL and Key must be provided in environment variables."
    );
}
// Create and export Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
