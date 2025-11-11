"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import ParticipantJoinPage from "./participantJoin";
import loginAction from "./action";
import { LoginFormData, loginSchema } from "@/app/schemas/auth";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const Login = () => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (data: LoginFormData) => {
        setServerError(null);
        startTransition(async () => {
            const response = await loginAction(data);

            // Handle server-side errors
            if (response?.error) {
                setServerError(response.error);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
                <Card className="bg-primary px-3 py-6 w-lg h-[32rem] p-12">
                    <Tabs
                        defaultValue="host"
                        className="flex flex-col justify-between gap-10 h-full"
                    >
                        <TabsList className="grid w-full grid-cols-2 bg-secondary">
                            <TabsTrigger
                                value="host"
                                className="data-[state=active]:bg-primary data-[state=active]:font-bold"
                            >
                                HOST
                            </TabsTrigger>
                            <TabsTrigger
                                value="participant"
                                className="data-[state=active]:bg-primary data-[state=active]:font-bold"
                            >
                                PARTICIPANT
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent
                            value="host"
                            className="flex flex-col justify-between h-full"
                        >
                            <CardContent className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        {...register("email")}
                                        id="email"
                                        name="email"
                                        type="email"
                                        className="bg-secondary"
                                        required
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        {...register("password")}
                                        id="password"
                                        name="password"
                                        type="password"
                                        className="bg-secondary"
                                        required
                                    />
                                    {errors.password && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>
                                {serverError && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {serverError}
                                    </p>
                                )}
                            </CardContent>
                            <div className="flex justify-between">
                                <div className="flex items-center">
                                    <Checkbox
                                        id="remember"
                                        className="mr-2 bg-secondary data-[state=checked]:bg-black cursor-pointer"
                                    />
                                    <Label
                                        htmlFor="remember"
                                        className="cursor-pointer"
                                    >
                                        Remember me
                                    </Label>
                                </div>
                                <p>
                                    <a
                                        href="#"
                                        className="text-sm font-medium italic underline hover:font-bold"
                                    >
                                        Forgot Password?
                                    </a>
                                </p>
                            </div>
                            <CardFooter className="flex flex-col justify-between mt-10 gap-5">
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full bg-foreground text-background border-2 border-foreground hover:text-foreground hover:bg-transparent group-hover:bg-accent group-hover:text-background disabled:bg-accent disabled:text-background disabled:border-accent hover:cursor-pointer"
                                >
                                    {isPending ? "Logging in..." : "LOGIN"}
                                </Button>
                                <p className="text-sm text-center">
                                    <a
                                        href="/signup"
                                        className=" font-medium italic underline hover:font-bold"
                                    >
                                        Don't have an account?
                                    </a>
                                </p>
                            </CardFooter>
                        </TabsContent>
                        <TabsContent
                            value="participant"
                            className="flex flex-col justify-between h-full"
                        >
                            <ParticipantJoinPage />
                        </TabsContent>
                    </Tabs>
                </Card>
            </div>
        </form>
    );
};

export default Login;
