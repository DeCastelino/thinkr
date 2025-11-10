"use client";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import signupAction from "./action";

const SignupButton = () => {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            formAction={signupAction}
            className="w-full bg-foreground outline-none shadow-none hover:bg-inherit hover:text-foreground hover:border-2 hover:border-foreground hover:cursor-pointer"
            disabled={pending}
        >
            {pending ? (
                <>
                    <Spinner className="mr-2 h-4 w-4" /> Please wait
                </>
            ) : (
                "SIGN UP"
            )}
        </Button>
    );
};

const Signup = () => {
    return (
        <form>
            <div className="flex flex-col gap-6">
                <Card className="bg-primary px-3 py-6 w-lg h-[32rem] p-12">
                    <div className="flex flex-col justify-between h-full">
                        <CardHeader>
                            <h1 className="text-3xl font-extrabold text-center italic">
                                Sign Up
                            </h1>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    className="bg-secondary"
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    className="bg-secondary"
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="password">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    name="confirm-password"
                                    className="bg-secondary"
                                    required
                                />
                            </div>
                        </CardContent>
                        <div className="mt-4">
                            <p className="text-sm text-center">
                                Already have an account?{" "}
                                <a
                                    href="/login"
                                    className=" font-bold underline"
                                >
                                    Login
                                </a>
                            </p>
                        </div>
                        <CardFooter className="flex justify-center mt-10">
                            <SignupButton />
                        </CardFooter>
                    </div>
                </Card>
            </div>
        </form>
    );
};

export default Signup;
