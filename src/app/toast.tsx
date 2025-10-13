"use client";

import { toast, Toaster } from "sonner";
import { Flex, Text } from "@radix-ui/themes";

export function ClientToaster() {
    return <Toaster/>;
}

export function raiseError(e: unknown) {
    toast.error(
        <Flex gap="1" direction="column">
            <Text size="1" weight="bold">发生错误</Text>
            <Text size="1">{String(e)}</Text>
        </Flex>
    );
}