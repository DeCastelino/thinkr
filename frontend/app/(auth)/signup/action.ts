"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "../../utils/supabase/server";

const signupAction = async (formData: FormData) => {
    const supabase = await createClient();

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    if (password !== confirmPassword) {
        console.error("Passwords do not match");
        return redirect("/signup?error=Passwords do not match");
    }

    const data = {
        email: formData.get("email") as string,
        password: password,
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) {
        console.error("Supabase sign-up error:", error.message);
        return redirect(`/signup?error=${encodeURIComponent(error.message)}`);
    }

    revalidatePath("/", "layout");
    redirect(
        "/login?message=Sign-up successful! Please check email to confirm"
    );
};

export default signupAction;
