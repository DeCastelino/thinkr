import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

const Login = () => {
    // ADD LOGIN LOGIC HERE

    return (
        <form action="">
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
                        </TabsContent>
                        <TabsContent
                            value="participant"
                            className="flex flex-col justify-between h-full"
                        >
                            <CardContent className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        type="username"
                                        className="bg-secondary"
                                        required
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="gameCode">Game Code</Label>
                                    <Input
                                        id="gameCode"
                                        type="text"
                                        className="bg-secondary"
                                        required
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-center mt-10">
                                <Button className="w-full bg-foreground outline-none shadow-none hover:bg-inherit hover:text-foreground hover:border-2 hover:border-foreground hover:cursor-pointer">
                                    JOIN
                                </Button>
                            </CardFooter>
                        </TabsContent>
                    </Tabs>
                </Card>
            </div>
        </form>
    );
};

export default Login;
