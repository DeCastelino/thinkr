import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Signup = () => {
    const handleLogin = async (formData: FormData) => {
        "use server";

        const rawData = {
            email: formData.get("email"),
            password: formData.get("password"),
        };
        console.log("Login Data:", rawData);
    };

    const handleJoin = async (formData: FormData) => {
        "use server";

        const rawData = {
            username: formData.get("username"),
            gameCode: formData.get("gameCode"),
        };
        console.log("Join Data:", rawData);
    };

    return (
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
                                className="bg-secondary"
                                required
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                className="bg-secondary"
                                required
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="password">Confirm Password</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                className="bg-secondary"
                                required
                            />
                        </div>
                    </CardContent>
                    <div className="mt-4">
                        <p className="text-sm text-center">
                            Already have an account?{" "}
                            <a href="/login" className=" font-bold underline">
                                Login
                            </a>
                        </p>
                    </div>
                    <CardFooter className="flex justify-center mt-10">
                        <Button
                            type="submit"
                            className="w-full bg-foreground outline-none shadow-none hover:bg-inherit hover:text-foreground hover:border-2 hover:border-foreground hover:cursor-pointer"
                        >
                            SIGN UP
                        </Button>
                    </CardFooter>
                </div>
            </Card>
        </div>
    );
};

export default Signup;
