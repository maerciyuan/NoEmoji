import { cookies } from "next/headers";
import { Card } from "@radix-ui/themes";
import { LoginForm } from "@/app/login/login-form";

export default async function Login() {
    const cookieStore = await cookies();
    const uid = cookieStore.get("uid");

    return <Card>
        {
            !!uid ? <LoginForm/> : ""
        }
    </Card>;
}