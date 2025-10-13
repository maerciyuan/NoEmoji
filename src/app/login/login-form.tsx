"use client";

import { Button, Flex, Heading, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { raiseError } from "@/app/toast";
import { loginOrRegister } from "@/app/actions/account";
import { toast } from "sonner";

export function LoginForm() {
    const [username, setUsername] = useState("");
    const [pwd, setPwd] = useState("");

    async function onSubmit() {
        try {
            await loginOrRegister(username, pwd);
            toast.success("登录成功");
            location.reload();
        } catch (e) {
            raiseError(e);
        }
    }

    return <Flex direction="column" gap="3" minWidth="20em" p="3">
        <Heading style={{ width: "100%", textAlign: "center" }} mb="4">欢迎回到 NoEmoji</Heading>
        <TextField.Root
            size="3"
            value={username}
            onChange={v => setUsername(v.target.value)}
            placeholder="用户名"
            type="text"
        />
        <TextField.Root
            size="3"
            value={pwd}
            onChange={v => setPwd(v.target.value)}
            placeholder="密码"
            type="password"
        />

        <Button onClick={onSubmit} disabled={!username || !pwd} size="3">登录 / 注册</Button>
    </Flex>;
}