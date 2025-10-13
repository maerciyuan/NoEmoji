"use client";

import { Button, Flex, Heading, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { raiseError } from "@/app/toast";
import { toast } from "sonner";
import { logout, updatePwd } from "@/app/actions/emoji";
import { UserInfo } from "@/app/actions/account";

export function UserForm({ user }: { user: UserInfo }) {
    const [pwd, setPwd] = useState("");

    async function onUpdatePwd() {
        try {
            await updatePwd(pwd);
            toast.success("已修改密码");
        } catch (e) {
            raiseError(e);
        }
    }

    async function onLogout() {
        await logout();
        location.reload();
    }

    return <Flex direction="column" gap="3" minWidth="20em" p="3">
        <Heading style={{ width: "100%", textAlign: "center" }} mb="4">欢迎，{user.name}！</Heading>
        <TextField.Root
            size="3"
            value={pwd}
            onChange={v => setPwd(v.target.value)}
            placeholder="新密码"
            type="password"
        />

        <Button onClick={onUpdatePwd} disabled={!pwd} size="3">变更密码</Button>
        <Button onClick={onLogout} color="red" size="3">注销</Button>
    </Flex>;
}