import { cookies } from "next/headers";
import { Card } from "@radix-ui/themes";
import { LoginForm } from "@/app/login/login-form";
import { UserForm } from "@/app/login/user-form";
import { getUserInfo } from "@/app/actions/account";

export default async function Login() {
    const cookieStore = await cookies();
    const uid = cookieStore.get("uid");

    if (uid) {
        const userInfo = await getUserInfo();

        return <Card><UserForm user={userInfo}/></Card>;
    }

    return <Card><LoginForm/></Card>;
}