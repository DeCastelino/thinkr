import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
                <Tabs defaultValue="host" className="h-full gap-10">
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
                    <form action={handleLogin} method="post" className="h-full">
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
                            <CardFooter className="flex justify-center mt-10">
                                <Button
                                    type="submit"
                                    className="w-full bg-foreground outline-none shadow-none hover:bg-inherit hover:text-foreground hover:border-2 hover:border-foreground hover:cursor-pointer"
                                >
                                    Login
                                </Button>
                            </CardFooter>
                        </TabsContent>
                    </form>
                    <form action={handleJoin} method="post" className="h-full">
                        <TabsContent
                            value="participant"
                            className="flex flex-col justify-between"
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
                                    Join
                                </Button>
                            </CardFooter>
                        </TabsContent>
                    </form>
                </Tabs>
            </Card>
        </div>
    );
};

export default Signup;
