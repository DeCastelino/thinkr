import { AppWindowIcon, CodeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Signup = () => {
    return (
        <div className="flex flex-col gap-6">
            <Card className="bg-primary px-3 py-6 w-lg h-[32rem] p-12">
                <form action="#" method="post">
                    <Tabs defaultValue="host" className="w-full gap-10">
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
                        <TabsContent value="host">
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
                                <Button className="w-full bg-foreground outline-none shadow-none hover:bg-inherit hover:text-foreground hover:border-2 hover:border-foreground hover:cursor-pointer">
                                    Login
                                </Button>
                            </CardFooter>
                        </TabsContent>
                        <TabsContent value="participant">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Password</CardTitle>
                                    <CardDescription>
                                        Change your password here. After saving,
                                        you&apos;ll be logged out.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="tabs-demo-current">
                                            Current password
                                        </Label>
                                        <Input
                                            id="tabs-demo-current"
                                            type="password"
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="tabs-demo-new">
                                            New password
                                        </Label>
                                        <Input
                                            id="tabs-demo-new"
                                            type="password"
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button>Save password</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </form>
            </Card>
        </div>
    );
};

export default Signup;
