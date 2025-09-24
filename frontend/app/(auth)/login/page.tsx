import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import loginAction from "./action";

const Login = async () => {
    return (
        <form>
            <div className="flex flex-col gap-6">
                <Card className="bg-primary px-3 py-6 w-lg h-[32rem] p-12">
                    <p className="text-3xl font-bold text-center">
                        Welcome Back!
                    </p>
                    <CardContent className="grid gap-6">
                        <div className="grid gap-3">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                className="bg-secondary"
                                required
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                className="bg-secondary"
                                required
                            />
                        </div>
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
                            formAction={loginAction}
                            className="w-full bg-foreground outline-none shadow-none hover:bg-inherit hover:text-foreground hover:border-2 hover:border-foreground hover:cursor-pointer"
                        >
                            LOGIN
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
                </Card>
            </div>
        </form>
    );
};

export default Login;
