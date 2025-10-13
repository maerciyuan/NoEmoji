"use client";

import { Flex, Grid, IconButton, Text } from "@radix-ui/themes";
import { EMOJIS } from "@/app/emojis";
import { submitEmoji } from "@/app/actions/emoji";
import { useState } from "react";
import { toast } from "sonner";

export default function ClientEmojiPanel() {
    const [submittingId, setSubmittingId] = useState(-1);

    async function onEmojiClick(id: number) {
        setSubmittingId(id);

        try {
            await submitEmoji(id);
            toast.success("已提交表情");
        } catch (e) {
            toast.error(
                <Flex gap="1" direction="column">
                    <Text size="1" weight="bold">发生错误</Text>
                    <Text size="1">{String(e)}</Text>
                </Flex>
            );
        } finally {
            setSubmittingId(-1);
        }
    }

    const isGlobalDisabled = submittingId >= 0;

    return (
        <Flex gap="5" direction="column" align="center">
            <Grid columns="5" gap="2">
                {
                    EMOJIS.map((em, id) => {
                        const isSelfDisabled = id === submittingId;

                        return <IconButton
                            onClick={() => onEmojiClick(id)}
                            disabled={isGlobalDisabled}
                            key={id}
                            variant="surface"
                            size="3"
                            radius="full"
                            loading={isSelfDisabled}
                        >
                            <Text size="4">{em}</Text>
                        </IconButton>;
                    })
                }
            </Grid>
        </Flex>
    );
}