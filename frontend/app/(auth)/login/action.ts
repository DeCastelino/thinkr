"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "../../utils/supabase/server";
import { LoginFormData, loginSchema } from "@/app/schemas/auth";

const loginAction = async (formData: LoginFormData) => {
    const result = loginSchema.safeParse(formData);
    if (!result.success) return { error: "Invalid form data" };

    const supabase = await createClient();
    const { email, password } = result.data;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) return { error: error.message };

    revalidatePath("/", "layout");
    redirect("/create-quiz");
};

export default loginAction;
